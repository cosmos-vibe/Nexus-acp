# Step 5: Plan Creation

> plan.md 생성

## Goal

구현 계획을 수립하고 plan.md 문서를 작성합니다.

## Role

**시니어 개발자** - 구현 가능한 계획 수립

## Execution

```xml
<step-execution>

<phase n="1" name="Load Template">
  <action>Load {template_plan}</action>
  <prepare>Template with placeholders</prepare>
</phase>

<phase n="2" name="Fill Section 1: Code Analysis Summary">
  <action>Summarize step 3 analysis:</action>
  <generate>
    ## 1. Code Analysis Summary

    ### Architecture
    {architecture_pattern}

    ### Related Files
    | File | Purpose | Action |
    |------|---------|--------|
    | {file} | {purpose} | Create/Modify/Reference |

    ### Key Patterns to Follow
    {patterns_identified}
  </generate>
</phase>

<phase n="3" name="Fill Section 2: Implementation Strategy">
  <collaborate>
    <display level-adaptive="true">
      <beginner>
        "이제 '어떻게 만들 건지' 계획을 세울 거예요.

        전략을 세 가지로 나눠 볼게요:
        1. 어떤 순서로 만들까? (의존성 고려)
        2. 어떤 패턴을 따를까? (기존 코드 참고)
        3. 주의할 점은? (함정 피하기)

        제가 초안을 작성할게요!"
      </beginner>
      <intermediate>
        "Implementation Strategy 섹션. 순서, 패턴, 주의사항을 포함합니다."
      </intermediate>
      <advanced>
        "S2: Implementation Strategy - sequence, patterns, considerations"
      </advanced>
      <expert>
        "S2: Strategy"
      </expert>
    </display>
    <generate>
      ## 2. Implementation Strategy

      ### Approach
      {high_level_approach}

      ### Implementation Order
      1. {first_step} - {reason}
      2. {second_step} - {reason}
      3. ...

      ### Patterns to Apply
      - {pattern_1}: {where_and_how}
      - {pattern_2}: {where_and_how}

      ### Considerations
      - {consideration_1}
      - {consideration_2}
    </generate>
    <ask>"전략이에요. 다른 접근법이 있을까요?"</ask>
  </collaborate>
</phase>

<phase n="4" name="Fill Section 3: Task List">
  <collaborate>
    <display level-adaptive="true">
      <beginner>
        "이제 할 일 목록을 만들 거예요!

        큰 작업(Task)을 작은 작업(Subtask)으로 나눠요.
        체크박스로 진행 상황을 추적할 수 있어요.

        예시:
        - [ ] Task 1: 로그인 폼 만들기
          - [ ] Subtask 1.1: 입력 필드 추가
          - [ ] Subtask 1.2: 버튼 추가
        "
      </beginner>
      <intermediate>
        "Task List 섹션. Tasks와 Subtasks로 구조화합니다."
      </intermediate>
      <advanced>
        "S3: Task breakdown"
      </advanced>
      <expert>
        "S3: Tasks"
      </expert>
    </display>
    <action>Break down into tasks based on requirements:</action>
    <generate>
      ## 3. Task List

      ### Tasks

      - [ ] **T-1: {task_name}** (AC: #{ac_number})
        - [ ] T-1.1: {subtask_1}
        - [ ] T-1.2: {subtask_2}
        - [ ] T-1.3: {subtask_3}

      - [ ] **T-2: {task_name}** (AC: #{ac_number})
        - [ ] T-2.1: {subtask_1}
        - [ ] T-2.2: {subtask_2}

      - [ ] **T-3: {task_name}** (AC: #{ac_number})
        - [ ] T-3.1: {subtask_1}

      ### Task Dependencies
      ```
      T-1 → T-2 → T-3
            ↘ T-4
      ```
    </generate>
    <ask>"작업 목록이에요. 빠진 작업이 있나요?"</ask>
  </collaborate>
</phase>

<phase n="5" name="Fill Section 4: Test Strategy">
  <collaborate>
    <generate>
      ## 4. Test Strategy

      ### Unit Tests
      | Component | Test Cases |
      |-----------|------------|
      | {component} | {test_cases} |

      ### Integration Tests
      - {integration_test_1}
      - {integration_test_2}

      ### Manual Testing
      - [ ] {manual_test_1}
      - [ ] {manual_test_2}

      ### Test Coverage Target
      {coverage_target}
    </generate>
    <ask>"테스트 전략이에요. 추가할 테스트가 있나요?"</ask>
  </collaborate>
</phase>

<phase n="6" name="Fill Section 5: Risks">
  <collaborate>
    <generate>
      ## 5. Risks & Mitigations

      | Risk | Probability | Impact | Mitigation |
      |------|-------------|--------|------------|
      | {risk_1} | {prob} | {impact} | {mitigation} |
      | {risk_2} | {prob} | {impact} | {mitigation} |

      ### Blockers to Watch
      - {potential_blocker_1}
      - {potential_blocker_2}
    </generate>
  </collaborate>
</phase>

<phase n="7" name="Review Complete Plan">
  <action>Display complete plan.md</action>
  <display level-adaptive="true">
    <beginner>
      "plan.md가 완성됐어요! 🎉

      이 문서는 '어떻게 만들 건지'를 정리한 거예요.
      체크박스로 진행 상황을 추적할 수 있어요.

      {full_plan}

      괜찮아 보이나요?"
    </beginner>
    <intermediate>
      "plan.md 완성:

      {full_plan}

      확인해 주세요."
    </intermediate>
    <advanced>
      "plan.md ready:

      {full_plan}"
    </advanced>
    <expert>
      "plan.md: {task_count} tasks, {subtask_count} subtasks"
    </expert>
  </display>
  <options>
    [Y] 확인 - 저장하고 다음으로
    [E] 수정 - 특정 섹션 수정
  </options>
</phase>

<phase n="8" name="Save plan.md">
  <action>Save to {default_output_folder}/plan.md</action>
  <verify>File created successfully</verify>
  <update meta.yaml>
    documents:
      spec: "spec.md"
      plan: "plan.md"
    stepsCompleted: ["init", "requirement-research", "codebase-analysis", "spec-creation", "plan-creation"]
  </update>
</phase>

</step-execution>
```

## Output

- `{sdd_root}/feature-{name}/plan.md` 생성됨
- meta.yaml 업데이트

## Next

Step 6 (Status Init)로 진행합니다.

## Menu

```
[A] Advanced Elicitation - plan 더 깊이 탐구
[P] Party Mode - 여러 관점에서 plan 검토
[C] Continue - 다음 단계로 (status.md 초기화)
[S] Save & Pause - 저장 후 나중에 재개
```
