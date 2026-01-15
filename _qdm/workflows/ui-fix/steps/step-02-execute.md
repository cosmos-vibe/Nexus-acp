# Step 2: Execute UI Change

> 변경 실행 및 추적

## Goal

UI 변경을 실행하고 간단한 status.md로 추적합니다.

## Execution

```xml
<step-execution>

<phase n="1" name="Create Work Folder">
  <action>Create {sdd_root}/ui-{ui_name}/</action>
  <generate file="meta.yaml">
    type: ui
    title: "{ui_title}"
    created: "{date}"
    status: in-progress
    complexity: lightweight
    estimated_files: {files_count}
  </generate>
</phase>

<phase n="2" name="Create Status File">
  <load>{template_status}</load>
  <generate file="status.md">
    ---
    title: "{ui_title}"
    created: "{date}"
    status: in-progress
    ---

    # UI Change: {ui_title}

    ## Request
    {ui_request}

    ## Expected Changes
    | File | Change |
    |------|--------|
    | {file_1} | {change_1} |
    | {file_2} | {change_2} |

    ## Tasks
    - [ ] T-1: {task_1}
    - [ ] T-2: {task_2}

    ## Work Log

    ### {date}
    - UI 변경 시작

    ## File List
    | 파일 | 상태 | 설명 |
    |------|------|------|
  </generate>
</phase>

<phase n="3" name="Guide Implementation">
  <display level-adaptive="true">
    <beginner>
      "이제 실제로 코드를 수정할 거예요! 🛠️

      수정할 파일:
      1. **{file_1}**
         - 위치: {file_1_path}
         - 변경: {change_1_description}
         - 방법: {how_to_change_1}

      2. **{file_2}** (있다면)
         - 위치: {file_2_path}
         - 변경: {change_2_description}

      파일을 열어볼까요?"
    </beginner>
    <intermediate>
      "수정 대상:
      1. {file_1}: {change_1}
      2. {file_2}: {change_2}

      시작하세요."
    </intermediate>
    <advanced>
      "Files:
      - {file_1}: {change_1}
      - {file_2}: {change_2}"
    </advanced>
    <expert>
      "{file_1}:{line_1}, {file_2}:{line_2}"
    </expert>
  </display>
</phase>

<phase n="4" name="Track Progress">
  <loop until="all tasks completed">
    <ask>"진행 상황을 알려주세요. (완료한 것, 문제 있는 것)"</ask>
    <on response>
      <update status.md>
        - Mark completed tasks: [x]
        - Add to Work Log
        - Update File List
      </update>
    </on>
    <menu>
      [C] 계속 (더 진행)
      [P] 문제 발생 (Debug Log)
      [X] 완료
    </menu>
  </loop>
</phase>

<phase n="5" name="Completion">
  <when all_tasks_done="true">
    <update status.md>
      status: done
      completed_at: "{date}"

      ## Completion Notes
      - {summary}
      - 변경된 파일: {files_changed}
    </update>
    <update meta.yaml>
      status: done
      completed_at: "{date}"
    </update>
    <update index.yaml>
      Move to completed_work
    </update>
    <display level-adaptive="true">
      <beginner>
        "🎉 UI 변경 완료!

        바뀐 점:
        {change_summary}

        파일들:
        {files_list}

        잘하셨어요! 👏"
      </beginner>
      <intermediate>
        "✅ 완료
        Changes: {change_summary}
        Files: {files_list}"
      </intermediate>
      <advanced>
        "Done. {files_list}"
      </advanced>
      <expert>
        "✓"
      </expert>
    </display>
  </when>
</phase>

</step-execution>
```

## Debug Log (문제 발생 시)

```markdown
## Debug Log

| 날짜 | 문제 | 시도 | 결과 |
|------|------|------|------|
| {date} | {problem} | {attempt} | {result} |
```

## Output

- status.md 완성
- meta.yaml 업데이트
- index.yaml 업데이트

## Workflow Complete

UI Fix 워크플로우가 완료되었습니다.
