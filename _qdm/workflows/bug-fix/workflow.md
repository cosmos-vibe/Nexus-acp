# Bug Fix Workflow

> 적응형 버그 수정 워크플로우 (3-5 steps)

## Overview

버그의 복잡도에 따라 자동으로 경로를 선택합니다:
- **Simple Path** (3 steps): 원인이 명확한 간단한 버그
- **Complex Path** (5 steps): 조사가 필요한 복잡한 버그

## Paths

```
step-01-assess
    │
    ├── Simple → step-02a-simple → Done (3 steps)
    │
    └── Complex → step-02b-investigate
                      │
                      └── step-03-root-cause
                              │
                              └── step-04-plan-fix
                                      │
                                      └── step-05-execute-fix → Done (5 steps)
```

## Execution

```xml
<workflow id="bug-fix" name="Bug Fix" steps="3-5" adaptive="true">

<entry-point>
  <load>{project-root}/{qdm_root}/config.yaml</load>
  <load>{sdd_root}/_user/profile.yaml as {profile}</load>
  <if bug_description_provided>
    <set>{bug_description} from user input</set>
  </if>
  <else>
    <ask>"어떤 버그가 있나요?"</ask>
  </else>
</entry-point>

<step n="1" name="assess" file="steps/step-01-assess.md">
  <goal>버그 정보 수집 및 복잡도 판단</goal>
  <actions>
    - Gather: symptoms, reproduction, expected behavior
    - Quick investigation: grep for errors
    - Determine complexity
  </actions>
  <routing>
    IF (cause_clear AND files <= 2 AND time < 30min):
      → step-02a-simple (Simple Path)
    ELSE:
      → step-02b-investigate (Complex Path)
  </routing>
</step>

<!-- Simple Path -->
<step n="2a" name="simple" file="steps/step-02a-simple.md" path="simple">
  <goal>간단한 버그 수정</goal>
  <actions>
    - Create folder and files
    - Document root cause
    - Guide fix
    - Verify
  </actions>
  <output>
    - {sdd_root}/bug-{name}/meta.yaml
    - {sdd_root}/bug-{name}/status.md
  </output>
  <complete>Workflow ends</complete>
</step>

<!-- Complex Path -->
<step n="2b" name="investigate" file="steps/step-02b-investigate.md" path="complex">
  <goal>체계적 조사</goal>
  <actions>
    - Create folder and files
    - Form hypotheses
    - Test each hypothesis
    - Document in Investigation Log
  </actions>
</step>

<step n="3" name="root-cause" file="steps/step-03-root-cause.md" path="complex">
  <goal>근본 원인 확정</goal>
  <actions>
    - Review investigation
    - Confirm root cause
    - Document evidence
  </actions>
</step>

<step n="4" name="plan-fix" file="steps/step-04-plan-fix.md" path="complex">
  <goal>수정 계획 수립</goal>
  <actions>
    - Design solution
    - Identify files to modify
    - Create fix tasks
    - Plan tests
  </actions>
</step>

<step n="5" name="execute-fix" file="steps/step-05-execute-fix.md" path="complex">
  <goal>수정 실행 및 검증</goal>
  <actions>
    - Execute fix tasks
    - Run tests
    - Verify fix
    - Document completion
  </actions>
  <complete>Workflow ends</complete>
</step>

<completion>
  <update>{sdd_root}/index.yaml</update>
  <display>"버그 수정 완료! 🐛✅"</display>
</completion>

</workflow>
```

## Complexity Criteria

| Factor | Simple | Complex |
|---
<!-- QDM Standalone -->-----|--------|---------|
| Cause | Clear/Obvious | Unknown |
| Files | ≤ 2 | > 2 |
| Time | < 30 min | > 30 min |
| Reproduction | Easy | Hard/Intermittent |
| Dependencies | None | Multiple |

## Variables

| Variable | Source | Description |
|----------|--------|-------------|
| {bug_description} | User input | 버그 설명 |
| {profile} | profile.yaml | 사용자 프로필 |
| {sdd_root} | config.yaml | SDD 폴더 경로 |

## Menu

각 단계에서:
```
[A] Advanced Elicitation - 더 깊은 분석
[P] Party Mode - 여러 관점에서 검토
[C] Continue - 다음 단계로
[S] Save & Pause - 저장 후 나중에
```
