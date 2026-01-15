# Restore Context Workflow

> 작업 재개를 위한 컨텍스트 복원 (3 steps)

## Overview

기존 작업을 이어서 진행하기 위해 모든 관련 문서를 읽고 컨텍스트를 복원합니다.

## Use Cases

- 다음 날 작업 재개
- 일주일 후 프로젝트 복귀
- 팀원이 작업 인계받을 때
- 컨텍스트 윈도우 초과로 새 세션 시작 시

## Execution

```xml
<workflow id="restore-context" name="Restore Context" steps="3">

<entry-point>
  <load>{project-root}/{qdm_root}/config.yaml</load>
  <load>{sdd_root}/_user/profile.yaml as {profile}</load>
</entry-point>

<step n="1" name="discover" file="steps/step-01-discover.md">
  <goal>기존 작업 탐색</goal>
  <actions>
    - Scan _sdd folder
    - Read all meta.yaml files
    - Categorize by status
    - Present work items to user
  </actions>
  <output>Work items list with status</output>
</step>

<step n="2" name="analyze" file="steps/step-02-analyze.md">
  <goal>선택된 작업 분석</goal>
  <actions>
    - Read all documents for selected work
    - Parse stepsCompleted
    - Identify current state
    - Find blockers or issues
  </actions>
  <output>Complete context for selected work</output>
</step>

<step n="3" name="summarize" file="steps/step-03-summarize.md">
  <goal>컨텍스트 요약 및 재개</goal>
  <actions>
    - Generate level-appropriate summary
    - Identify next action
    - Offer continuation options
  </actions>
  <output>Ready to continue work</output>
</step>

<completion>
  <route>
    Based on work type and stepsCompleted:
    - feature-dev → appropriate step
    - bug-fix → appropriate step
    - ui-fix → appropriate step
  </route>
</completion>

</workflow>
```

## Variables

| Variable | Source | Description |
|---
<!-- QDM Standalone -->-------|--------|-------------|
| {sdd_root} | config.yaml | SDD 폴더 경로 |
| {profile} | profile.yaml | 사용자 프로필 |
| {selected_work} | User choice | 선택된 작업 |

## Context Restoration Depth

| Scenario | What to Read |
|----------|--------------|
| Same day | status.md Work Log (recent) |
| Next day | status.md full, plan.md tasks |
| Week+ | All documents, spec.md included |
| New person | Everything + profile setup |
