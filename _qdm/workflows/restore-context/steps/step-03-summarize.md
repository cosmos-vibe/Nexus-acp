# Step 3: Summarize and Resume

> 컨텍스트 요약 및 재개

## Goal

분석된 정보를 사용자 수준에 맞게 요약하고 작업 재개를 돕습니다.

## Execution

```xml
<step-execution>

<phase n="1" name="Generate Summary">
  <display level-adaptive="true">
    <beginner>
      "📋 작업 정보를 정리했어요!

      **{title}** ({type_korean})

      ---

      **지금까지 한 것:**
      {completed_summary_detailed}

      **현재 상태:**
      {current_state_explanation}

      **다음에 할 것:**
      {next_action_detailed}

      ---

      잠깐! 기억나지 않는 부분이 있으면 말씀해 주세요.
      spec.md나 plan.md를 다시 보여드릴 수 있어요."
    </beginner>
    <intermediate>
      "**{title}**

      Completed:
      {completed_list}

      Current: {current_state}
      Next: {next_action}

      Ready to continue?"
    </intermediate>
    <advanced>
      "{title}
      Done: {completed_short}
      Current: {current_state}
      Next: {next_action}"
    </advanced>
    <expert>
      "{title}: {current_state} → {next_action}"
    </expert>
  </display>
</phase>

<phase n="2" name="Show Blockers (if any)">
  <if blockers_exist>
    <display level-adaptive="true">
      <beginner>
        "⚠️ 주의할 점이 있어요:

        {blockers_detailed}

        이거 해결하고 진행할까요, 아니면 일단 넘어갈까요?"
      </beginner>
      <intermediate>
        "⚠️ Blockers:
        {blockers_list}

        [R] Resolve first | [S] Skip for now"
      </intermediate>
      <advanced>
        "Blockers: {blockers_short}"
      </advanced>
      <expert>
        "⚠️ {blockers_count} blockers"
      </expert>
    </display>
  </if>
</phase>

<phase n="3" name="Offer Options">
  <display level-adaptive="true">
    <beginner>
      "어떻게 할까요?

      [C] 이어서 진행 - {next_action_short}
      [R] 문서 다시 보기 - spec이나 plan 확인
      [S] 상태만 보기 - status.md 열기
      [N] 다른 작업 - 메뉴로 돌아가기

      번호나 글자를 입력하세요!"
    </beginner>
    <intermediate>
      "[C] Continue: {next_action}
      [R] Review documents
      [S] Show status
      [N] Different work"
    </intermediate>
    <advanced>
      "[C] {next_action} | [R] Review | [S] Status | [N] Menu"
    </advanced>
    <expert>
      "[C] [R] [S] [N]"
    </expert>
  </display>
</phase>

<phase n="4" name="Handle Choice">
  <on choice="C">
    <determine workflow_and_step>
      Based on {type} and {stepsCompleted}:
      - feature + ["init","requirement-research"] → feature-dev/step-03
      - feature + [...,"spec-creation"] → feature-dev/step-05
      - feature + ["...", "ready-for-dev"] → Show status.md, start tasks
      - bug + ["assess"] → bug-fix/step-02a or step-02b
      - bug + ["assess","investigate"] → bug-fix/step-03
      - ui + ["assess"] → ui-fix/step-02
    </determine>
    <load>{target_workflow}/{target_step}</load>
    <pass context>{analyzed_context}</pass>
  </on>

  <on choice="R">
    <ask>"어떤 문서를 볼까요? [1] spec.md [2] plan.md [3] status.md"</ask>
    <display selected_document>
    <return to="Offer Options">
  </on>

  <on choice="S">
    <display>{selected_work}/status.md</display>
    <ask>"이어서 진행할까요?"</ask>
  </on>

  <on choice="N">
    <display>"메뉴로 돌아갑니다. /qdm을 입력하세요."</display>
    <exit>workflow</exit>
  </on>
</phase>

</step-execution>
```

## Level-Specific Summary Examples

### Beginner
```
📋 작업 정보를 정리했어요!

**로그인 기능** (새 기능 개발)

---

**지금까지 한 것:**
✅ 작업 폴더 만들기
✅ 요구사항 분석 - 어떤 기능이 필요한지 정리
✅ 코드 분석 - 어디에 코드를 넣을지 파악
✅ spec.md 작성 - "뭘 만들 건지" 문서 완성

**현재 상태:**
plan.md를 작성하는 중이에요.
이건 "어떻게 만들 건지"를 정리하는 문서예요.

**다음에 할 것:**
plan.md의 "구현 전략" 섹션을 채워야 해요.
어떤 순서로 코드를 작성할지 정하는 거예요.
```

### Expert
```
feature-login: spec-creation → plan-creation (T-1 pending)
```

## Output

- User-level appropriate summary displayed
- User chose how to proceed
- Routed to appropriate workflow step

## Workflow Complete

Context restoration 완료. 선택된 작업의 워크플로우로 이동합니다.
