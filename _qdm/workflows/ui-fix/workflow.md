# UI Fix Workflow

> 경량 UI/UX 변경 워크플로우 (2 steps)

## Overview

시각적 변경만 필요한 작업을 위한 경량 워크플로우입니다.
로직 변경이 필요하거나 복잡한 경우 Feature workflow로 라우팅합니다.

## Scope

**적합한 작업:**
- 색상, 폰트, 간격 변경
- 버튼 스타일 수정
- 레이아웃 미세 조정
- 아이콘 교체

**부적합한 작업 (→ Feature):**
- 새 컴포넌트 추가
- 상태 관리 변경
- API 연동 필요
- 3개 이상 파일 수정

## Execution

```xml
<workflow id="ui-fix" name="UI Fix" steps="2">

<entry-point>
  <load>{project-root}/{qdm_root}/config.yaml</load>
  <load>{sdd_root}/_user/profile.yaml as {profile}</load>
  <if ui_request_provided>
    <set>{ui_request} from user input</set>
  </if>
  <else>
    <ask>"어떤 UI 변경이 필요한가요?"</ask>
  </else>
</entry-point>

<step n="1" name="assess" file="steps/step-01-assess.md">
  <goal>요청 분석 및 복잡도 판단</goal>
  <actions>
    - Analyze request
    - Estimate files to change
    - Check for logic changes
    - Determine if lightweight applicable
  </actions>
  <routing>
    IF (files <= 2 AND no_logic_change AND time < 30min):
      → step-02
    ELSE:
      → Suggest Feature workflow
  </routing>
</step>

<step n="2" name="execute" file="steps/step-02-execute.md">
  <goal>변경 실행 및 추적</goal>
  <actions>
    - Create folder and meta.yaml
    - Create lightweight status.md
    - Guide implementation
    - Track changes
  </actions>
  <output>
    - {sdd_root}/ui-{name}/meta.yaml
    - {sdd_root}/ui-{name}/status.md
  </output>
</step>

<completion>
  <update>{sdd_root}/index.yaml</update>
  <display>"UI 변경 완료! ✅"</display>
</completion>

</workflow>
```

## Variables

| Variable | Source | Description |
|---
<!-- QDM Standalone -->-------|--------|-------------|
| {ui_request} | User input | 변경 요청 |
| {profile} | profile.yaml | 사용자 프로필 |
| {sdd_root} | config.yaml | SDD 폴더 경로 |

## Menu

각 단계에서:
```
[F] Feature로 전환 - 복잡한 작업인 경우
[C] Continue - 다음 단계로
[S] Save & Pause - 저장 후 나중에
[X] 종료
```
