# Step 3: Codebase Analysis

> 코드베이스 분석

## Goal

구현에 필요한 코드베이스 컨텍스트를 파악합니다. 패턴, 의존성, 수정할 파일을 식별합니다.

## Role

**시니어 아키텍트** - 코드베이스를 깊이 이해하고 구현 방향을 제시

## Execution

```xml
<step-execution>

<phase n="1" name="Project Structure Overview">
  <action>Scan project structure using list_dir or Glob</action>
  <identify>
    - Language/Framework (React, Vue, Node, etc.)
    - Architecture pattern (MVC, layered, etc.)
    - Key directories (src/, components/, api/, etc.)
  </identify>
  <report level-adaptive="true">
    <beginner>
      "프로젝트 구조를 살펴봤어요!

      📁 이 프로젝트는 {framework}를 사용해요.

      주요 폴더:
      - {folder1}: {description1} (여기에 화면 관련 코드가 있어요)
      - {folder2}: {description2} (여기에 서버 통신 코드가 있어요)

      마치 집에서 방마다 역할이 다른 것처럼, 코드도 폴더마다 역할이 달라요!"
    </beginner>
    <intermediate>
      "프로젝트 분석:
      - Framework: {framework}
      - Architecture: {pattern}
      - Key directories: {directories}"
    </intermediate>
    <advanced>
      "Stack: {framework}, {pattern}
      Dirs: {directories}"
    </advanced>
    <expert>
      "{framework} | {pattern} | {dir_list}"
    </expert>
  </report>
</phase>

<phase n="2" name="Find Related Code">
  <action>Based on requirements from step 2, search for related code:</action>
  <search>
    - Use Grep for keywords from requirements
    - Use Glob for file patterns
    - Read key files to understand patterns
  </search>
  <identify>
    - Similar features already implemented
    - Reusable components/utilities
    - API endpoints related to feature
    - Database models/schemas if applicable
  </identify>
  <report level-adaptive="true">
    <beginner>
      "비슷한 코드를 찾아봤어요!

      ✅ 재사용할 수 있는 것:
      {reusable_code_with_explanations}

      📝 참고할 수 있는 것:
      {reference_code_with_explanations}

      이 파일들을 보면 어떻게 만들면 되는지 힌트를 얻을 수 있어요!"
    </beginner>
    <intermediate>
      "관련 코드:
      - 재사용: {reusable}
      - 참고: {reference}
      - 패턴: {patterns}"
    </intermediate>
    <advanced>
      "Reuse: {reusable}
      Ref: {reference}
      Pattern: {patterns}"
    </advanced>
    <expert>
      "Reuse: {file_list} | Ref: {file_list} | Pattern: {pattern_names}"
    </expert>
  </report>
  <store as="related_code" />
</phase>

<phase n="3" name="Identify Dependencies">
  <action>Map dependencies for the new feature:</action>
  <analyze>
    - Internal dependencies (other modules/components)
    - External dependencies (npm packages, APIs)
    - Data flow (where data comes from, where it goes)
  </analyze>
  <report level-adaptive="true">
    <beginner>
      "이 기능을 만들려면 다른 부분들과 연결해야 해요.

      🔗 내부 연결:
      {internal_deps_explained}

      📦 외부 라이브러리:
      {external_deps_explained}

      🔄 데이터 흐름:
      {data_flow_explained}

      레고 블록처럼 여러 조각이 연결되는 거예요!"
    </beginner>
    <intermediate>
      "의존성:
      - Internal: {internal_deps}
      - External: {external_deps}
      - Data flow: {data_flow}"
    </intermediate>
    <advanced>
      "Deps: {internal_deps} + {external_deps}
      Flow: {data_flow}"
    </advanced>
    <expert>
      "Int: {deps} | Ext: {deps} | Flow: {flow}"
    </expert>
  </report>
  <store as="dependencies" />
</phase>

<phase n="4" name="Identify Files to Modify/Create">
  <action>Based on analysis, list files:</action>
  <categorize>
    <create>New files to be created</create>
    <modify>Existing files to be modified</modify>
    <reference>Files to reference but not change</reference>
  </categorize>
  <report level-adaptive="true">
    <beginner>
      "구현하려면 이런 파일들이 필요해요:

      ✨ 새로 만들 파일:
      {new_files_with_purpose}

      ✏️ 수정할 파일:
      {modify_files_with_changes}

      👀 참고할 파일:
      {reference_files_with_reason}

      걱정 마세요, 하나씩 차근차근 할 거예요!"
    </beginner>
    <intermediate>
      "파일 목록:
      - Create: {new_files}
      - Modify: {modify_files}
      - Reference: {reference_files}"
    </intermediate>
    <advanced>
      "Create: {files}
      Modify: {files}
      Ref: {files}"
    </advanced>
    <expert>
      "New: {list} | Mod: {list} | Ref: {list}"
    </expert>
  </report>
  <store as="file_plan" />
</phase>

<phase n="5" name="Check Brownfield Context">
  <check if="{sdd_root}/_context/ exists">
    <action>Load brownfield context:</action>
    <load>
      - codebase-snapshot.md
      - architecture-notes.md
      - patterns-inventory.md
    </load>
    <integrate>Merge with current analysis</integrate>
  </check>
</phase>

<phase n="6" name="Update meta.yaml">
  <action>Add to meta.yaml:</action>
  <add>
    codebase_analysis:
      framework: "{framework}"
      architecture: "{pattern}"
      related_code: [...]
      dependencies:
        internal: [...]
        external: [...]
      file_plan:
        create: [...]
        modify: [...]
        reference: [...]
    stepsCompleted: ["init", "requirement-research", "codebase-analysis"]
  </add>
  <save>{default_output_folder}/meta.yaml</save>
</phase>

</step-execution>
```

## Output

- 코드베이스 컨텍스트 파악
- 파일 계획 (생성/수정/참조)
- meta.yaml 업데이트

## Next

Step 4 (Spec Creation)로 진행합니다.

## Menu

```
[A] Advanced Elicitation - 코드 분석 더 깊이
[P] Party Mode - 아키텍트들의 의견 듣기
[C] Continue - 다음 단계로 (spec.md 작성)
[S] Save & Pause - 저장 후 나중에 재개
```
