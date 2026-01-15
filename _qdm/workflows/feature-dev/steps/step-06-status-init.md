# Step 6: Status Init

> status.md 초기화

## Goal

개발 진행 상황을 추적할 status.md를 초기화합니다.

## Role

**프로젝트 매니저** - 진행 상황 추적 체계 설정

## Execution

```xml
<step-execution>

<phase n="1" name="Load Template">
  <action>Load {template_status}</action>
  <prepare>Template with placeholders</prepare>
</phase>

<phase n="2" name="Copy Tasks from plan.md">
  <action>Read {default_output_folder}/plan.md</action>
  <extract>Section 3: Task List</extract>
  <copy>All tasks and subtasks with checkboxes</copy>
</phase>

<phase n="3" name="Generate status.md">
  <generate>
    ---
    title: "{feature_name}"
    created: "{date}"
    updated: "{date}"
    status: "in-progress"
    spec_ref: "spec.md"
    plan_ref: "plan.md"
    ---

    # Status: {feature_name}

    ## Tasks / Subtasks

    <!-- plan.md에서 복사됨 -->
    {copied_tasks}

    ---

    ## Work Log

    ### {date}

    **작업 내용:**
    - spec.md, plan.md, status.md 초기화 완료
    - 개발 준비 완료

    ---

    ## Debug Log

    | 날짜 | 문제 | 시도 | 결과 |
    |------|------|------|------|
    | | | | |

    ---

    ## File List

    | 파일 | 상태 | 설명 |
    |------|------|------|
    | | new / modified / deleted | |

    ---

    ## Completion Notes

    <!-- 완료 시 작성 -->
  </generate>
</phase>

<phase n="4" name="Explain Status Sections">
  <display level-adaptive="true">
    <beginner>
      "status.md가 생성됐어요! 이 파일의 역할을 설명드릴게요.

      📋 **Tasks / Subtasks**
      - plan.md에서 복사한 할 일 목록이에요
      - 작업할 때마다 체크박스를 체크하세요 ✓
      - 예: `- [x] T-1.1: 완료된 작업`

      📝 **Work Log**
      - 매일 한 일을 기록해요
      - 나중에 뭘 했는지 기억하기 좋아요

      🐛 **Debug Log**
      - 문제가 생기면 여기에 기록해요
      - 어떻게 해결했는지도 적어요
      - 나중에 비슷한 문제가 생기면 참고할 수 있어요

      📁 **File List**
      - 수정한 파일들을 적어요
      - 코드 리뷰할 때 유용해요

      ✅ **Completion Notes**
      - 작업 완료하면 여기에 요약을 적어요
      "
    </beginner>
    <intermediate>
      "status.md 섹션:
      - Tasks: 진행 상황 체크
      - Work Log: 일일 작업 기록
      - Debug Log: 문제 해결 이력
      - File List: 변경 파일 목록
      - Completion Notes: 완료 시 요약"
    </intermediate>
    <advanced>
      "status.md ready:
      - Tasks from plan
      - Work/Debug/File logs
      - Completion notes section"
    </advanced>
    <expert>
      "status.md: {task_count} tasks, logs initialized"
    </expert>
  </display>
</phase>

<phase n="5" name="Save status.md">
  <action>Save to {default_output_folder}/status.md</action>
  <verify>File created successfully</verify>
  <update meta.yaml>
    documents:
      spec: "spec.md"
      plan: "plan.md"
      status: "status.md"
    stepsCompleted: ["init", "requirement-research", "codebase-analysis", "spec-creation", "plan-creation", "status-init"]
    status: "ready-for-dev"
  </update>
</phase>

<phase n="6" name="Update Index">
  <action>Update {sdd_root}/index.yaml</action>
  <update>
    active_work.feature-{feature_name}.status: "ready-for-dev"
  </update>
</phase>

</step-execution>
```

## Output

- `{sdd_root}/feature-{name}/status.md` 생성됨
- meta.yaml 업데이트 (status: ready-for-dev)
- index.yaml 업데이트

## Append-Only Rule

**중요**: status.md의 Work Log와 Debug Log는 **절대 수정하지 않습니다**.
- 새 내용만 추가 (append-only)
- 기존 로그 삭제/수정 금지
- 실패 기록도 소중한 학습 자료

## Next

Step 7 (Ready for Dev)로 진행합니다.

## Menu

```
[C] Continue - 다음 단계로 (개발 준비 완료)
[S] Save & Pause - 저장 후 나중에 재개
```
