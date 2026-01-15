# Step 1: Discover Existing Work

> 기존 작업 탐색

## Goal

_sdd 폴더를 스캔하여 모든 작업 항목을 찾고 사용자에게 보여줍니다.

## Execution

```xml
<step-execution>

<phase n="1" name="Scan SDD Folder">
  <action>List all directories in {sdd_root}</action>
  <filter>
    Include: feature-*, bug-*, ui-*
    Exclude: _user, _archive, _context
  </filter>
</phase>

<phase n="2" name="Read Meta Files">
  <for-each folder in work_folders>
    <read>{folder}/meta.yaml</read>
    <extract>
      - type: feature | bug | ui
      - title: work title
      - status: in-progress | blocked | done
      - created: date
      - stepsCompleted: array
      - priority: high | medium | low
    </extract>
  </for-each>
</phase>

<phase n="3" name="Categorize Work">
  <categorize>
    in_progress: status == "in-progress"
    blocked: status == "blocked"
    paused: status == "paused"
    ready_for_dev: status == "ready-for-dev"
    done: status == "done"
  </categorize>
</phase>

<phase n="4" name="Display Work Items">
  <display level-adaptive="true">
    <beginner>
      "이전에 진행했던 작업들을 찾았어요! 📂

      🔄 **진행 중** ({in_progress_count}개)
      {for each in_progress}
      [{n}] {icon} {title}
          - 상태: {status_description}
          - 시작일: {created}
          - 마지막 작업: {last_activity}
      {end for}

      ⏸️ **일시 정지** ({paused_count}개)
      {for each paused}
      [{n}] {icon} {title}
      {end for}

      ✅ **최근 완료** ({done_count}개, 최근 5개)
      {for each done limit 5}
      - {title} ({completed_at})
      {end for}

      어떤 작업을 이어서 할까요? 번호를 선택하세요!"
    </beginner>
    <intermediate>
      "Work items:

      In Progress ({count}):
      {work_list}

      Paused ({count}):
      {paused_list}

      Select to continue:"
    </intermediate>
    <advanced>
      "Active: {active_list}
      Paused: {paused_list}
      Select:"
    </advanced>
    <expert>
      "{numbered_list}"
    </expert>
  </display>
</phase>

<phase n="5" name="Handle Selection">
  <on user_input>
    <if number>
      <set>{selected_work} = work_items[number]</set>
      <route>step-02-analyze</route>
    </if>
    <if "new" or "N">
      <display>"새 작업을 시작하려면 /qdm 메뉴에서 선택하세요."</display>
      <exit>workflow</exit>
    </if>
  </on>
</phase>

</step-execution>
```

## Work Item Display Format

```
[1] 🔧 feature-login
    - 상태: Plan 작성 중 (step 5/7)
    - 시작일: 2026-01-05
    - 마지막: spec.md 완료

[2] 🐛 bug-api-timeout
    - 상태: 조사 중 (step 2b)
    - 시작일: 2026-01-07
    - 마지막: H2 가설 검증 중
```

## Output

- All work items discovered
- User selected one to continue
- {selected_work} set

## Menu

```
[1-n] 작업 선택
[N] 새 작업 시작 (메뉴로)
[X] 취소
```
