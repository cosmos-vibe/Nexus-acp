# Step 1: Assess UI Request

> 요청 분석 및 복잡도 판단

## Goal

UI 변경 요청을 분석하고 경량 워크플로우 적합 여부를 판단합니다.

## Execution

```xml
<step-execution>

<phase n="1" name="Understand Request">
  <display level-adaptive="true">
    <beginner>
      "어떤 UI를 바꾸고 싶으신가요? 🎨

      예시:
      - '버튼 색상을 파란색에서 초록색으로'
      - '헤더 폰트 크기를 더 크게'
      - '여백을 좀 더 넓게'

      자세히 알려주세요!"
    </beginner>
    <intermediate>
      "UI 변경 요청을 알려주세요.
      (예: 버튼 색상, 레이아웃, 폰트 등)"
    </intermediate>
    <advanced>
      "UI change request?"
    </advanced>
    <expert>
      "UI:"
    </expert>
  </display>
  <gather>
    - What element to change
    - What property to modify
    - Target value/state
  </gather>
</phase>

<phase n="2" name="Analyze Complexity">
  <action>Use Glob/Grep to find related files:</action>
  <search>
    - CSS/SCSS files with element name
    - Component files
    - Style imports
  </search>
  <evaluate>
    files_count: How many files need changes?
    logic_change: Does it require JavaScript logic?
    estimated_time: How long will it take?
  </evaluate>
</phase>

<phase n="3" name="Complexity Decision">
  <decision>
    <condition test="files_count <= 2 AND NOT logic_change AND estimated_time < 30min">
      <result>LIGHTWEIGHT - Continue with UI Fix</result>
      <display level-adaptive="true">
        <beginner>
          "좋아요! 간단한 변경이네요. 😊
          바로 진행해볼게요.

          예상 파일: {files_list}
          예상 시간: {estimated_time}분"
        </beginner>
        <intermediate>
          "경량 변경으로 진행합니다.
          Files: {files_list}
          Time: ~{estimated_time}min"
        </intermediate>
        <advanced>
          "Lightweight OK. {files_count} files, ~{estimated_time}min"
        </advanced>
        <expert>
          "OK. {files_list}"
        </expert>
      </display>
    </condition>
    <condition test="ELSE">
      <result>COMPLEX - Suggest Feature workflow</result>
      <display level-adaptive="true">
        <beginner>
          "음, 이건 생각보다 복잡해 보여요. 🤔

          이유:
          {complexity_reasons}

          더 체계적인 Feature 워크플로우를 추천해요.
          거기서 spec과 plan을 만들면 더 안전하게 진행할 수 있어요."
        </beginner>
        <intermediate>
          "복잡한 변경입니다: {complexity_reasons}
          Feature workflow 사용을 권장합니다."
        </intermediate>
        <advanced>
          "Complex: {complexity_reasons}
          Recommend: Feature workflow"
        </advanced>
        <expert>
          "→ Feature. {complexity_reasons}"
        </expert>
      </display>
      <menu>
        [F] Feature workflow로 전환
        [C] 그래도 경량으로 진행 (권장하지 않음)
        [X] 취소
      </menu>
    </condition>
  </decision>
</phase>

<phase n="4" name="Proceed if Lightweight">
  <if condition="LIGHTWEIGHT">
    <action>Proceed to step-02-execute</action>
  </if>
</phase>

</step-execution>
```

## Complexity Criteria

| Factor | Lightweight | Complex |
|--------|-------------|---------|
| Files | ≤ 2 | > 2 |
| Logic | CSS/style only | JS required |
| Time | < 30 min | > 30 min |
| Components | Existing | New needed |
| State | None | State change |

## Output

- Complexity assessment
- File list
- Time estimate
- Routing decision

## Menu

```
[F] Feature로 전환
[C] Continue (경량 적합 시)
[X] 취소
```
