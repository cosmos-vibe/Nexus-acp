# Step 7: Ready for Dev

> 개발 준비 완료

## Goal

문서화를 마무리하고 개발 시작을 위한 가이드를 제공합니다.

## Role

**개발 가이드** - 개발 시작을 위한 안내

## Execution

```xml
<step-execution>

<phase n="1" name="Verify Documents">
  <action>Check all required documents exist:</action>
  <verify>
    - [ ] meta.yaml exists and valid
    - [ ] spec.md exists and complete
    - [ ] plan.md exists with tasks
    - [ ] status.md exists with copied tasks
  </verify>
  <report>
    <success>"모든 문서가 준비됐어요! ✅"</success>
    <failure>"문서가 누락됐어요: {missing_docs}"</failure>
  </report>
</phase>

<phase n="2" name="Display Summary">
  <display level-adaptive="true">
    <beginner>
      "🎉 축하해요! 개발 준비가 완료됐어요!

      📁 생성된 파일:
      └── _sdd/feature-{feature_name}/
          ├── meta.yaml    ← 작업 정보
          ├── spec.md      ← 뭘 만들 건지 (요구사항)
          ├── plan.md      ← 어떻게 만들 건지 (계획)
          └── status.md    ← 진행 상황 추적

      📊 요약:
      - 기능 요구사항: {fr_count}개
      - 비기능 요구사항: {nfr_count}개
      - 할 일: {task_count}개 Tasks, {subtask_count}개 Subtasks

      이제 코드를 작성할 차례예요! 🚀"
    </beginner>
    <intermediate>
      "✅ 개발 준비 완료

      Documents:
      - spec.md: {fr_count} FR, {nfr_count} NFR
      - plan.md: {task_count} tasks
      - status.md: initialized

      Ready to start T-1."
    </intermediate>
    <advanced>
      "Ready. {task_count} tasks, {subtask_count} subtasks.
      Start: T-1 in status.md"
    </advanced>
    <expert>
      "Ready. T-1 → T-{last_task}. status.md"
    </expert>
  </display>
</phase>

<phase n="3" name="Development Guide">
  <display level-adaptive="true">
    <beginner>
      "개발 진행 방법을 알려드릴게요:

      1️⃣ **status.md 열기**
         - 여기서 할 일을 확인하고 체크해요

      2️⃣ **첫 번째 Task 시작**
         - T-1부터 순서대로 진행해요
         - 완료하면 체크: `- [x] T-1.1: ...`

      3️⃣ **Work Log 작성**
         - 하루 끝에 한 일을 기록해요
         - 간단하게 적어도 돼요

      4️⃣ **문제가 생기면?**
         - Debug Log에 기록해요
         - 나중에 비슷한 문제에 도움이 돼요

      5️⃣ **파일 수정하면?**
         - File List에 추가해요

      힘내세요! 질문이 있으면 `/qdm` → [CH] 대화로 물어보세요! 💪"
    </beginner>
    <intermediate>
      "개발 진행:
      1. status.md에서 T-1부터 시작
      2. 완료 시 체크박스 체크
      3. Work Log에 일일 기록
      4. 문제 발생 시 Debug Log
      5. 변경 파일 File List에 추가"
    </intermediate>
    <advanced>
      "Workflow:
      - Track in status.md
      - Work Log daily
      - Debug Log for issues
      - File List for changes"
    </advanced>
    <expert>
      "Track: status.md | Log: work/debug | Files: file list"
    </expert>
  </display>
</phase>

<phase n="4" name="Update Profile (Optional)">
  <check if="new evidence discovered during workflow">
    <action>Update {profile_path} with new observations:</action>
    <example>
      - If user showed frontend expertise: Update skills.frontend.level
      - If user struggled with concepts: Note in gaps
    </example>
    <note>Only update if clear evidence. Ask user to confirm.</note>
  </check>
</phase>

<phase n="5" name="Final meta.yaml Update">
  <update meta.yaml>
    stepsCompleted: ["init", "requirement-research", "codebase-analysis", "spec-creation", "plan-creation", "status-init", "ready-for-dev"]
    workflow_completed: true
    ready_for_dev: true
    workflow_completed_at: "{date}"
  </update>
</phase>

<phase n="6" name="Offer Next Steps">
  <display level-adaptive="true">
    <beginner>
      "다음에 할 수 있는 것들:

      [1] 개발 시작하기 - status.md 열고 T-1부터!
      [2] 다른 작업 시작 - `/qdm` → 메뉴
      [3] 질문하기 - `/qdm` → [CH] 대화

      무엇을 할까요?"
    </beginner>
    <intermediate>
      "[1] Start T-1
      [2] New work: /qdm
      [3] Questions: /qdm → CH"
    </intermediate>
    <advanced>
      "[1] T-1 | [2] /qdm | [3] CH"
    </advanced>
    <expert>
      "[1] T-1 [2] menu [3] chat"
    </expert>
  </display>
</phase>

</step-execution>
```

## Output

- 모든 문서 완성 확인
- 개발 가이드 제공
- meta.yaml 최종 업데이트

## Workflow Complete

Feature Development 워크플로우가 완료되었습니다.

## Files Created

```
_sdd/feature-{name}/
├── meta.yaml       ✅ 완성
├── spec.md         ✅ 완성
├── plan.md         ✅ 완성
└── status.md       ✅ 완성
```

## Menu

```
[X] Workflow 종료 - 메뉴로 돌아가기
```
