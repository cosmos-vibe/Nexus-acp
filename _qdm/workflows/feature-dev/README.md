# Feature Development Workflow

새 기능 개발을 위한 문서 중심 워크플로우입니다.

## 목적

- 기능 요구사항을 명확히 정의 (spec.md)
- 구현 계획을 수립 (plan.md)
- 진행 상황을 추적 (status.md)

## 7단계 프로세스

1. **Init** - 폴더 생성, profile 로드
2. **Requirement Research** - 요구사항 분석, FR/NFR 도출
3. **Codebase Analysis** - 관련 코드 분석, 패턴 파악
4. **Spec Creation** - spec.md 작성
5. **Plan Creation** - plan.md 작성
6. **Status Init** - status.md 초기화
7. **Ready for Dev** - 개발 준비 완료

## 사용법

```bash
# Quinn 메뉴에서
/qdm → [FT] 새 기능 개발

# 직접 실행
/qdm:feature "로그인 기능 추가"
```

## 출력물

```
_sdd/feature-{name}/
├── meta.yaml    # 메타데이터
├── spec.md      # 요구사항 명세
├── plan.md      # 구현 계획
└── status.md    # 진행 상황
```

## 파일 구조

```
feature-dev/
├── workflow.md      # 메인 워크플로우
├── workflow.yaml    # 설정
├── README.md        # 이 파일
├── instructions.md  # 실행 지침
├── template.md      # (사용 안 함)
├── steps/
│   ├── step-01-init.md
│   ├── step-02-requirement-research.md
│   ├── step-03-codebase-analysis.md
│   ├── step-04-spec-creation.md
│   ├── step-05-plan-creation.md
│   ├── step-06-status-init.md
│   └── step-07-ready-for-dev.md
├── data/            # 워크플로우 데이터
└── templates/       # 워크플로우 템플릿
```
