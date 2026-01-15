# Task: Context Builder

> SDD 폴더 스캔하여 AI 컨텍스트 구축

## Purpose

_sdd 폴더를 스캔하여 현재 프로젝트의 모든 작업 현황을 파악하고 AI 컨텍스트를 구축합니다.

## Input

| Parameter | Source | Description |
|-----------|--------|-------------|
| sdd_root | config.yaml | SDD 폴더 경로 |

## Execution

```xml
<task name="context-builder">

<step n="1" name="Load Index">
  <read>{sdd_root}/index.yaml</read>
  <extract>
    project_name: project name
    active_work: list of active items
    completed_work: list of completed items
    archived_items: reference to archives
  </extract>
</step>

<step n="2" name="Load Profile">
  <task-call name="profile-reader">
    <param name="profile_path">{sdd_root}/_user/profile.yaml</param>
  </task-call>
  <store as="{profile}"/>
</step>

<step n="3" name="Scan Active Work">
  <for-each folder in "{sdd_root}/[feature|bug|ui]-*">
    <read>{folder}/meta.yaml</read>
    <extract>
      type: feature | bug | ui
      title: work title
      status: current status
      priority: high | medium | low
      created: date
      stepsCompleted: array
    </extract>
    <read if_exists>{folder}/status.md</read>
    <extract>
      progress: percentage from tasks
      last_session: most recent Work Log entry
      blockers: from Debug Log
    </extract>
    <add to="active_work_details"/>
  </for-each>
</step>

<step n="4" name="Calculate Statistics">
  <compute>
    total_active: count(active_work_details)
    by_type:
      features: count where type == "feature"
      bugs: count where type == "bug"
      ui: count where type == "ui"
    by_status:
      in_progress: count where status == "in-progress"
      blocked: count where status == "blocked"
      ready_for_dev: count where status == "ready-for-dev"
    oldest_active: min(created) item
    highest_priority: items where priority == "high"
  </compute>
</step>

<step n="5" name="Generate Context Summary">
  <generate format="markdown">
# Project Context: {project_name}

## Active Work ({total_active} items)

### By Type
- Features: {features_count}
- Bugs: {bugs_count}
- UI Changes: {ui_count}

### By Status
- In Progress: {in_progress_count}
- Blocked: {blocked_count}
- Ready for Dev: {ready_for_dev_count}

## Work Details

{for each active_work_details}
### {icon} {title} ({type})
- **Status:** {status}
- **Priority:** {priority}
- **Progress:** {progress}%
- **Last Activity:** {last_session}
- **Path:** {folder_path}
{if blockers}
- **⚠️ Blockers:** {blockers}
{end if}
{end for}

## User Profile
- **Level:** {profile.overall_level}
- **Strengths:** {advanced_domains}
- **Growth Areas:** {beginner_domains}

## Recommended Next Actions
{ai_recommendations}
  </generate>
</step>

<step n="6" name="Return Context">
  <return>
    summary: {generated_summary}
    active_work: {active_work_details}
    profile: {profile}
    statistics: {statistics}
    recommendations: {recommendations}
  </return>
</step>

</task>
```

## Output

```yaml
summary: |
  # Project Context: MyProject
  ...

active_work:
  - type: feature
    title: "로그인 기능"
    status: ready-for-dev
    priority: high
    progress: 100
    folder: "_sdd/feature-login"
  - type: bug
    title: "API 타임아웃"
    status: investigating
    priority: medium
    progress: 40
    folder: "_sdd/bug-api-timeout"

profile:
  overall_level: intermediate
  skills: { ... }

statistics:
  total_active: 2
  by_type: { features: 1, bugs: 1, ui: 0 }
  by_status: { in_progress: 1, ready_for_dev: 1 }

recommendations:
  - "feature-login이 개발 준비 완료. T-1부터 시작하세요."
  - "bug-api-timeout 조사 계속 필요."
```

## Usage

```xml
<task-call name="context-builder">
  <param name="sdd_root">{sdd_root}</param>
</task-call>

<!-- Now {context} is available -->
<display>{context.summary}</display>
```

## AI Recommendations Logic

| Condition | Recommendation |
|-----------|----------------|
| ready-for-dev items | "Start development on {title}" |
| blocked items | "Resolve blocker: {blocker}" |
| high priority | "Prioritize {title}" |
| old in-progress | "Continue or archive {title}" |
| no active work | "Start a new task with /qdm" |
