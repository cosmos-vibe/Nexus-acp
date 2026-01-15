# Step 4: Plan Fix

> 수정 계획 수립 (Complex Path)

## Goal

근본 원인을 해결하기 위한 구체적인 수정 계획을 수립합니다.

## Execution

```xml
<step-execution>

<phase n="1" name="Review Root Cause">
  <action>Read status.md Root Cause section</action>
  <context>
    - Root cause: {root_cause}
    - Affected files: {affected_files}
    - Impact: {impact_summary}
  </context>
</phase>

<phase n="2" name="Design Solution">
  <display level-adaptive="true">
    <beginner>
      "이제 해결책을 설계해 볼게요! 🛠️

      **문제:** {root_cause}

      **해결 방법:**
      {solution_approach}

      왜 이 방법이 좋냐면:
      {why_this_approach}

      다른 방법도 있지만:
      - {alternative_1}: {why_not_1}
      - {alternative_2}: {why_not_2}

      이 방법으로 진행할까요?"
    </beginner>
    <intermediate>
      "Solution approach: {solution_approach}

      Alternatives considered:
      - {alternative_1}: {rejection_reason_1}

      Proceed with this approach?"
    </intermediate>
    <advanced>
      "Approach: {solution_approach}
      Rationale: {rationale}"
    </advanced>
    <expert>
      "Fix: {solution_short}"
    </expert>
  </display>
</phase>

<phase n="3" name="Identify Changes">
  <display level-adaptive="true">
    <beginner>
      "수정할 파일들을 정리해 볼게요:

      | 파일 | 변경 내용 |
      |------|----------|
      | {file_1} | {change_1_description} |
      | {file_2} | {change_2_description} |

      각 파일에서 뭘 바꿔야 하는지 설명해 드릴게요!"
    </beginner>
    <intermediate>
      "Files to modify:
      | File | Change |
      |------|--------|
      | {file_1} | {change_1} |
      | {file_2} | {change_2} |"
    </intermediate>
    <advanced>
      "Changes: {file_1}:{change_1}, {file_2}:{change_2}"
    </advanced>
    <expert>
      "{file_changes_list}"
    </expert>
  </display>
</phase>

<phase n="4" name="Create Tasks">
  <generate tasks>
    - T-1: {fix_task_1}
    - T-2: {fix_task_2}
    - T-3: {fix_task_3}
    - T-4: 테스트 작성/실행
    - T-5: 회귀 테스트 확인
  </generate>
</phase>

<phase n="5" name="Plan Tests">
  <display level-adaptive="true">
    <beginner>
      "수정 후 테스트도 계획해야 해요:

      **확인할 것들:**
      - TC-1: {test_case_1} (버그가 고쳐졌는지)
      - TC-2: {test_case_2} (다른 게 안 망가졌는지)
      - TC-3: {test_case_3} (엣지 케이스)

      테스트는 중요해요! 안 하면 나중에 같은 버그가 돌아올 수 있어요."
    </beginner>
    <intermediate>
      "Test scenarios:
      - TC-1: {test_1} (fix verification)
      - TC-2: {test_2} (regression)
      - TC-3: {test_3} (edge cases)"
    </intermediate>
    <advanced>
      "Tests: {test_summary}"
    </advanced>
    <expert>
      "TC: {test_list}"
    </expert>
  </display>
</phase>

<phase n="6" name="Update Status File">
  <update status.md section="Fix Plan">
    ## Fix Plan

    ### Approach
    {solution_approach}

    ### Files to Modify
    | 파일 | 변경 내용 |
    |------|----------|
    | {file_1} | {change_1} |
    | {file_2} | {change_2} |

    ### Tasks
    - [ ] T-1: {task_1}
    - [ ] T-2: {task_2}
    - [ ] T-3: {task_3}
    - [ ] T-4: 테스트 작성/실행
    - [ ] T-5: 회귀 테스트 확인

    ### Test Scenarios
    - TC-1: {test_1} (fix verification)
    - TC-2: {test_2} (regression)
    - TC-3: {test_3} (edge cases)
  </update>
  <update meta.yaml>
    status: fix-planned
    stepsCompleted: ["assess", "investigate", "root-cause", "plan-fix"]
  </update>
</phase>

</step-execution>
```

## Output

- Fix Plan 섹션 완성
- Tasks 목록 생성
- Test scenarios 정의
- meta.yaml 업데이트

## Next

Step 5 (Execute Fix)로 진행합니다.

## Menu

```
[A] Advanced Elicitation - 계획 더 상세화
[P] Party Mode - 계획 검토
[C] Continue - 수정 실행으로 (step-05)
[S] Save & Pause - 저장 후 나중에
```
