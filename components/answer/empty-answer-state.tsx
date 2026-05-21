import Link from "next/link";
import Button from "@/components/ui/button";

// TODO (H): 빈 상태 콘텐츠 개선
// 입력값: 없음 (항상 동일한 빈 상태 표시)
// 해야 할 일:
//   1. 텍스트를 더 따뜻하고 구체적으로 수정 (예: "아직 대화가 없어요. 첫 질문을 건네볼까요?")
//   2. 아이콘 또는 일러스트 추가 (말풍선, 질문 아이콘 등)
// 완료 기준: 빈 상태에서도 사용자가 다음 행동을 직관적으로 알 수 있음

// TODO (H): CTA 버튼 액션 개선
// 입력값: 없음
// 해야 할 일: "팀원 탐색" 외에 "질문 둘러보기" 등 대안 액션 추가 고려
// 완료 기준: 사용자가 빈 상태에서 최소 1가지 명확한 행동을 할 수 있음

export default function EmptyAnswerState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* TODO (H): 아이콘 또는 일러스트 */}
      <p className="text-gray-400 mb-1">아직 기록된 대화가 없어요.</p>
      <p className="text-sm text-gray-300 mb-6">팀원에게 질문을 건네보세요.</p>
      <Link href="/recommendations">
        <Button variant="primary">팀원 탐색하러 가기</Button>
      </Link>
    </div>
  );
}
