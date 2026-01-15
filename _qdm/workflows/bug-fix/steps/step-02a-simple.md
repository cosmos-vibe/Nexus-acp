# Step 2a: Simple Bug Fix

> 간단한 버그 직접 수정 (Simple Path)

## Goal

원인이 명확한 버그를 빠르게 수정합니다.

## Execution

```xml
<step-execution>

<phase n="1" name="Create Status File">
  <load>{template_status}</load>
  <generate file="status.md">
    ---
    title: "{bug_title}"
    created: "{date}"
    status: in-progress
    path: simple
    ---

    # Bug Fix: {bug_title}

    ## Symptoms
    {symptoms}

    ## Reproduction
    {reproduce_steps}

    ## Expected Behavior
    {expected_behavior}

    ## Root Cause
    **원인:** {root_cause}
    **파일:** {suspect_file}
    **상세:** {cause_detail}

    ## Tasks
    - [ ] T-1: {fix_task_1}
    - [ ] T-2: 테스트 확인

    ## Work Log

    ### {date}
    - 버그 분석 완료
    - 원인 파악: {root_cause}

    ## Debug Log
    | 날짜 | 문제 | 시도 | 결과 |
    |------|------|------|------|

    ## File List
    | 파일 | 상태 | 설명 |
    |------|------|------|
  </generate>
</phase>

<phase n="2" name="Guide Fix">
  <display level-adaptive="true">
    <beginner>
      "원인을 찾았어요! 이제 고쳐볼게요. 🔧

      **문제:** {root_cause_simple}

      **해결 방법:**
      {file_to_edit}을(를) 열어서
      {line_number}번째 줄 근처를 보세요.

      현재 코드:
      ```
      {current_code}
      ```

      이렇게 바꾸면 돼요:
      ```
      {fixed_code}
      ```

      왜 이렇게 바꾸냐면... {explanation}"
    </beginner>
    <intermediate>
      "Root cause: {root_cause}

      Fix:
      - File: {file_to_edit}:{line_number}
      - Change: {change_description}

      ```diff
      - {current_code}
      + {fixed_code}
      ```"
    </intermediate>
    <advanced>
      "Fix: {file_to_edit}:{line_number}
      {change_description}"
    </advanced>
    <expert>
      "{file_to_edit}:{line_number} - {change_summary}"
    </expert>
  </display>
</phase>

<phase n="3" name="Execute and Verify">
  <ask>"수정을 진행하셨나요?"</ask>
  <on response="yes">
    <action>Verify the fix:</action>
    <display level-adaptive="true">
      <beginner>
        "잘했어요! 이제 확인해 볼게요. ✅

        1. 재현 단계를 다시 시도해 보세요:
           {reproduce_steps}

        2. 버그가 없어졌나요?"
      </beginner>
      <intermediate>
        "Verify:
        1. Re-test reproduction steps
        2. Check related functionality"
      </intermediate>
      <advanced>
        "Verify: re-run repro steps"
      </advanced>
      <expert>
        "Verify"
      </expert>
    </display>
  </on>
  <on response="no">
    <ask>"어디서 막히셨나요?"</ask>
    <action>Provide additional guidance</action>
  </on>
</phase>

<phase n="4" name="Completion">
  <when verified="true">
    <update status.md>
      status: done
      completed_at: "{date}"

      ## Completion Notes
      - Root cause: {root_cause}
      - Fix applied: {fix_summary}
      - Verified: {verification_result}
    </update>
    <update meta.yaml>
      status: done
      completed_at: "{date}"
      root_cause: "{root_cause}"
      affected_files: ["{file_1}"]
    </update>
    <update index.yaml>
      Move to completed_work
    </update>
    <display level-adaptive="true">
      <beginner>
        "🎉 버그가 해결됐어요!

        **원인:** {root_cause}
        **해결:** {fix_summary}

        다음에 비슷한 문제가 생기면 이 기록이 도움될 거예요.
        고생하셨어요! 👏"
      </beginner>
      <intermediate>
        "✅ Bug fixed
        Root cause: {root_cause}
        Solution: {fix_summary}"
      </intermediate>
      <advanced>
        "Fixed. {root_cause} → {fix_summary}"
      </advanced>
      <expert>
        "✓ Fixed"
      </expert>
    </display>
  </when>
</phase>

</step-execution>
```

## Output

- status.md 완성
- meta.yaml 업데이트
- 버그 수정 완료

## Workflow Complete (Simple Path)

Simple Bug Fix가 완료되었습니다.
