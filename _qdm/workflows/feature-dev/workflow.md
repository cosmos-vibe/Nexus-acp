# Feature Development Workflow

> 새 기능 개발을 위한 spec + plan + status 3문서 체계

## Overview

이 워크플로우는 새 기능을 개발할 때 체계적으로 문서화하고 추적하는 7단계 프로세스입니다.

```
[1] Init → [2] Research → [3] Analyze → [4] Spec → [5] Plan → [6] Status → [7] Ready
```

## Workflow Execution

```xml
<workflow-init>
  <load>workflow.yaml from this directory</load>
  <resolve>All {config_source}:field references</resolve>
  <load>profile from {profile_path}</load>
  <set>{current_step} = 1</set>
</workflow-init>

<workflow-loop>
  <for-each step="1 to 7">
    <load>{steps_path}/step-{n}-{name}.md</load>
    <execute>Step instructions</execute>
    <on-complete>
      <update>meta.yaml stepsCompleted</update>
      <menu>
        [A] Advanced Elicitation - 더 깊이 탐구
        [P] Party Mode - 여러 관점에서 논의
        [C] Continue - 다음 단계로
        [S] Save & Pause - 저장 후 나중에 재개
      </menu>
      <wait-for-input />
    </on-complete>
  </for-each>
</workflow-loop>

<workflow-complete>
  <verify>All 3 documents created: spec.md, plan.md, status.md</verify>
  <update>index.yaml with new feature</update>
  <report>Summary to user</report>
</workflow-complete>
```

## Steps Summary

| Step | Name | Goal | Output |
|---
<!-- QDM Standalone -->---|------|------|--------|
| 1 | init | 폴더 생성 및 초기화 | meta.yaml |
| 2 | requirement-research | 요구사항 분석 | FR/NFR 목록 |
| 3 | codebase-analysis | 코드베이스 분석 | 패턴/의존성 파악 |
| 4 | spec-creation | spec.md 생성 | spec.md |
| 5 | plan-creation | plan.md 생성 | plan.md |
| 6 | status-init | status.md 초기화 | status.md |
| 7 | ready-for-dev | 개발 준비 완료 | 개발 가이드 |

## Level Adaptation

이 워크플로우는 사용자 수준에 따라 설명을 조정합니다:

- **beginner**: 각 단계를 상세히 설명, 비유 사용
- **intermediate**: 핵심 개념 위주 설명
- **advanced**: 간결한 기술적 설명
- **expert**: 최소한의 설명, 파일:줄번호 형식

## Resume Support

작업 중단 시:
1. 현재 step이 meta.yaml에 기록됨
2. `/qdm` → [RW] Resume Work로 재개 가능
3. stepsCompleted 기반으로 다음 단계부터 시작

## Menu Options

각 단계 완료 후:
- **[A] Advanced Elicitation**: 더 깊이 탐구 (질문 심화)
- **[P] Party Mode**: 여러 에이전트 관점에서 논의
- **[C] Continue**: 다음 단계로 진행
- **[S] Save & Pause**: 저장 후 나중에 재개

## Files Created

```
_sdd/feature-{name}/
├── meta.yaml       # 메타데이터 (type, status, stepsCompleted)
├── spec.md         # 뭘 만들 건가 (요구사항, 성공 기준)
├── plan.md         # 어떻게 만들 건가 (구현 전략, 작업 목록)
└── status.md       # 진행 상황 (체크박스, Work Log)
```
