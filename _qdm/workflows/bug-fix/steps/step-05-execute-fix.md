# Step 5: Execute Fix

> 수정 실행 및 검증 (Complex Path)

## Goal

계획대로 수정을 실행하고 테스트로 검증합니다.

## Execution

```xml
<step-execution>

<phase n="1" name="Review Plan">
  <action>Read status.md Fix Plan section</action>
  <display level-adaptive="true">
    <beginner>
      "수정 계획을 다시 확인해 볼게요:

      **할 일:**
      {tasks_list}

      **수정할 파일:**
      {files_list}

      하나씩 진행해 볼까요?"
    </beginner>
    <intermediate>
      "Fix plan ready.
      Tasks: {task_count}
      Files: {files_list}"
    </intermediate>
    <advanced>
      "Tasks: {task_count}, Files: {files_list}"
    </advanced>
    <expert>
      "T:{task_count} F:{file_count}"
    </expert>
  </display>
</phase>

<phase n="2" name="Execute Tasks" loop="true">
  <for-each task in tasks>
    <display level-adaptive="true">
      <beginner>
        "**{task.id}: {task.description}**

        {detailed_guidance}

        파일: {task.file}
        현재 코드:
        ```
        {current_code}
        ```

        변경할 코드:
        ```
        {new_code}
        ```

        진행하시겠어요?"
      </beginner>
      <intermediate>
        "{task.id}: {task.description}
        File: {task.file}
        Change: {change_summary}"
      </intermediate>
      <advanced>
        "{task.id}: {task.file} - {change_summary}"
      </advanced>
      <expert>
        "{task.id}: {task.file}"
      </expert>
    </display>
    <on completion>
      <update status.md>
        Mark task as completed: [x]
      </update>
      <append to="Work Log">
        - {task.id} 완료: {completion_note}
      </append>
      <append to="File List">
        | {file} | modified | {change_description} |
      </append>
    </on>
    <on issue>
      <append to="Debug Log">
        | {date} | {issue} | {attempt} | {result} |
      </append>
    </on>
  </for-each>
</phase>

<phase n="3" name="Run Tests">
  <display level-adaptive="true">
    <beginner>
      "수정이 끝났어요! 이제 테스트해 볼게요. 🧪

      **테스트 1: 버그 수정 확인**
      {test_1_instructions}

      버그가 고쳐졌나요?"
    </beginner>
    <intermediate>
      "Testing:
      1. Fix verification: {test_1}
      2. Regression: {test_2}
      3. Edge cases: {test_3}"
    </intermediate>
    <advanced>
      "Tests: {test_summary}"
    </advanced>
    <expert>
      "Test"
    </expert>
  </display>
  <record>
    | Test | Expected | Actual | Pass/Fail |
    |------|----------|--------|-----------|
    | TC-1 | {expected_1} | {actual_1} | {result_1} |
    | TC-2 | {expected_2} | {actual_2} | {result_2} |
  </record>
</phase>

<phase n="4" name="Verify Fix">
  <decision>
    <condition test="all_tests_pass">
      <display level-adaptive="true">
        <beginner>
          "🎉 모든 테스트 통과!

          버그가 완전히 고쳐졌어요!

          **수정 요약:**
          - 원인: {root_cause}
          - 해결: {fix_summary}
          - 수정된 파일: {files_modified}

          정말 잘하셨어요! 👏"
        </beginner>
        <intermediate>
          "✅ All tests pass
          Fix verified: {fix_summary}"
        </intermediate>
        <advanced>
          "✅ Verified. {fix_summary}"
        </advanced>
        <expert>
          "✓"
        </expert>
      </display>
    </condition>
    <condition test="some_tests_fail">
      <display level-adaptive="true">
        <beginner>
          "음, 아직 문제가 있어요. 😕

          실패한 테스트:
          {failed_tests}

          다시 확인해 볼까요?"
        </beginner>
        <intermediate>
          "Tests failed: {failed_tests}
          Review needed."
        </intermediate>
        <advanced>
          "Failed: {failed_tests}"
        </advanced>
        <expert>
          "✗ {failed_tests}"
        </expert>
      </display>
      <action>Debug and retry</action>
    </condition>
  </decision>
</phase>

<phase n="5" name="Completion">
  <when all_verified="true">
    <update status.md>
      status: done
      completed_at: "{date}"

      ## Completion Notes

      ### Summary
      - **Root Cause:** {root_cause}
      - **Solution:** {solution_summary}
      - **Files Modified:** {files_count}
      - **Tests Added:** {tests_added}

      ### Verification
      All test scenarios passed:
      - TC-1: ✓
      - TC-2: ✓
      - TC-3: ✓

      ### Lessons Learned
      {lessons_learned}
    </update>
    <update meta.yaml>
      status: done
      completed_at: "{date}"
      resolution: "{solution_summary}"
      affected_files: [{files}]
      tests_added: [{tests}]
      stepsCompleted: ["assess", "investigate", "root-cause", "plan-fix", "execute-fix"]
    </update>
    <update index.yaml>
      Move to completed_work
    </update>
  </when>
</phase>

</step-execution>
```

## Output

- 모든 Tasks 완료
- 테스트 검증 완료
- status.md Completion Notes 작성
- meta.yaml 최종 업데이트

## Workflow Complete (Complex Path)

Complex Bug Fix가 완료되었습니다.

## Files Created/Updated

```
_sdd/bug-{name}/
├── meta.yaml       ✅ 완성
└── status.md       ✅ 완성
    ├── Symptoms
    ├── Reproduction
    ├── Investigation Log
    ├── Root Cause
    ├── Fix Plan
    ├── Tasks [x]
    ├── Work Log
    ├── Debug Log
    ├── File List
    └── Completion Notes
```
