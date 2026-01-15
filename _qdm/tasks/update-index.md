# Task: Update Index

> index.yaml 작업 상태 관리

## Purpose

index.yaml에 작업 항목을 추가, 업데이트, 완료 처리, 아카이브합니다.

## Input

| Parameter | Type | Description |
|-----------|------|-------------|
| action | enum | add \| update \| complete \| archive |
| work_id | string | 작업 ID (예: feature-login) |
| data | object | 업데이트할 데이터 |

## Execution

```xml
<task name="update-index">

<step n="1" name="Read Index">
  <read>{sdd_root}/index.yaml</read>
  <parse as="yaml"/>
</step>

<step n="2" name="Execute Action">
  <switch action="{action}">

    <case value="add">
      <validate>
        - work_id not in active_work
        - data has required fields: type, title, status, created
      </validate>
      <add to="active_work">
        {work_id}:
          type: {data.type}
          title: {data.title}
          status: {data.status}
          created: {data.created}
          priority: {data.priority ?? "medium"}
          folder: "_sdd/{work_id}"
      </add>
      <update>
        metadata.total_items: +1
        metadata.active_items: +1
        metadata.last_updated: {current_date}
      </update>
    </case>

    <case value="update">
      <validate>
        - work_id in active_work
      </validate>
      <update path="active_work.{work_id}">
        {for each field in data}
        {field}: {value}
        {end for}
      </update>
      <update>
        metadata.last_updated: {current_date}
      </update>
    </case>

    <case value="complete">
      <validate>
        - work_id in active_work
      </validate>
      <move from="active_work.{work_id}" to="completed_work.{work_id}">
        <add field="completed_at">{current_date}</add>
      </move>
      <update>
        metadata.active_items: -1
        metadata.completed_items: +1
        metadata.last_updated: {current_date}
      </update>
    </case>

    <case value="archive">
      <validate>
        - work_id in completed_work
      </validate>
      <move folder="{sdd_root}/{work_id}" to="{sdd_root}/_archive/{YYYY-MM}/{work_id}"/>
      <move from="completed_work.{work_id}" to="archived_items">
        <add field="archived_at">{current_date}</add>
        <add field="archive_path">"_archive/{YYYY-MM}/{work_id}"</add>
      </move>
      <update>
        metadata.completed_items: -1
        metadata.last_updated: {current_date}
      </update>
    </case>

  </switch>
</step>

<step n="3" name="Write Index">
  <write>{sdd_root}/index.yaml</write>
</step>

<step n="4" name="Return Result">
  <return>
    success: true
    action: {action}
    work_id: {work_id}
    new_state: {updated_item}
  </return>
</step>

</task>
```

## index.yaml Structure

```yaml
# QDM Work Index

metadata:
  created: "2026-01-05"
  last_updated: "2026-01-09"
  total_items: 5
  active_items: 2
  completed_items: 3

active_work:
  feature-login:
    type: feature
    title: "로그인 기능"
    status: ready-for-dev
    created: "2026-01-05"
    priority: high
    folder: "_sdd/feature-login"

  bug-api-timeout:
    type: bug
    title: "API 타임아웃"
    status: investigating
    created: "2026-01-07"
    priority: medium
    folder: "_sdd/bug-api-timeout"

completed_work:
  ui-button-color:
    type: ui
    title: "버튼 색상 변경"
    status: done
    created: "2026-01-06"
    completed_at: "2026-01-06"
    folder: "_sdd/ui-button-color"

archived_items:
  # References to archived work
  # feature-signup:
  #   archive_path: "_archive/2026-01/feature-signup"
  #   archived_at: "2026-01-03"
```

## Usage

```xml
<!-- Add new work -->
<task-call name="update-index">
  <param name="action">add</param>
  <param name="work_id">feature-login</param>
  <param name="data">
    type: feature
    title: "로그인 기능"
    status: in-progress
    created: "2026-01-05"
    priority: high
  </param>
</task-call>

<!-- Update status -->
<task-call name="update-index">
  <param name="action">update</param>
  <param name="work_id">feature-login</param>
  <param name="data">
    status: ready-for-dev
  </param>
</task-call>

<!-- Mark as complete -->
<task-call name="update-index">
  <param name="action">complete</param>
  <param name="work_id">feature-login</param>
</task-call>

<!-- Archive completed work -->
<task-call name="update-index">
  <param name="action">archive</param>
  <param name="work_id">feature-login</param>
</task-call>
```

## Archive Folder Structure

```
_sdd/_archive/
├── 2026-01/
│   ├── feature-signup/
│   │   ├── meta.yaml
│   │   ├── spec.md
│   │   ├── plan.md
│   │   └── status.md
│   └── ui-header-fix/
│       ├── meta.yaml
│       └── status.md
└── 2025-12/
    └── ...
```

## Status Transitions

```
[add] → in-progress
         ↓
     [update] status changes
         ↓
[complete] → done (moves to completed_work)
         ↓
[archive] → archived (moves folder to _archive/)
```
