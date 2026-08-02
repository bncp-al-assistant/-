from dataclasses import dataclass, field
from typing import List, Optional
 
@dataclass
class BenefitItem:
    title: str
    target: str
    description: str
    contact_person: str
    contact_phone: str
    contact_email: str
 
class HanwhaWelfareManager:
    """(주)한화 건설부문 복리후생 데이터 관리자"""
 
    def __init__(self):
        self.benefits: List[BenefitItem] = []
        self._load_initial_data()
 
    def _load_initial_data(self):
        # 01. 건강검진
        self.benefits.append(BenefitItem(
            title="건강검진",
            target="전 임직원 및 배우자",
            description="임원(정밀검진), 직원(종합검진) 지원 / 순천향대 서울병원 등 지정병원 이용",
            contact_person="김민석 사원",
            contact_phone="02-729-5757",
            contact_email="ms085@hanwha.com"
        ))
 
        # 02. 경조휴가 및 경조금
        self.benefits.append(BenefitItem(
            title="경조휴가 및 경조금",
            target="전 임직원",
            description="본인/자녀 결혼, 출산, 본인/가족 사망 등 경조금, 경조휴가, 화환, 장례용품 지원",
            contact_person="박성준 사원",
            contact_phone="010-7343-0634",
            contact_email="psj0523@hanwha.com"
        ))
 
        # 03. 경조사 문자 서비스
        self.benefits.append(BenefitItem(
            title="경조사 문자 서비스",
            target="전 임직원",
            description="경조사 발생 시 서클 '경조사알림' 게시글 등록을 통해 임직원 대상 경조사 안내 문자 발송",
            contact_person="박성준 사원",
            contact_phone="010-7343-0634",
            contact_email="psj0523@hanwha.com"
        ))
 
        # 04. 장례용품 서비스
        self.benefits.append(BenefitItem(
            title="장례용품 서비스",
            target="전 임직원",
            description="해피엔딩(주)을 통한 장례용품 300인분 1BOX 또는 유가족 편의용품세트 1BOX 지원(최대 2BOX), 추가구매 가능",
            contact_person="박성준 사원",
            contact_phone="010-7343-0634",
            contact_email="psj0523@hanwha.com"
        ))
 
        # 05. 학자금
        self.benefits.append(BenefitItem(
            title="학자금",
            target="근속 조건 충족 임직원 (미취학, 초/중/고/대 자녀)",
            description="미취학자녀(월 10만원), 입학축하금(30만원), 중/고등(분기 80만원), 대학(학기 450만원)",
            contact_person="박성준 사원",
            contact_phone="010-7343-0634",
            contact_email="psj0523@hanwha.com"
        ))
 
        # 06. Refresh포인트
        self.benefits.append(BenefitItem(
            title="Refresh포인트",
            target="Refresh 휴가 사용자",
            description="연 최대 70만P 상당 Refresh 특별포인트 지급 (건설 Refresh 복지몰 이용)",
            contact_person="김학철 과장",
            contact_phone="010-4236-4864",
            contact_email="hakchul.kim@hanwha.com"
        ))
 
        # 07. 리조트 이용
        self.benefits.append(BenefitItem(
            title="리조트 이용",
            target="전 임직원",
            description="한화리조트 디럭스/스위트/로얄 객실 이용, 연 6객실 한도, 당일 예약(잔여객실 한), 법인회원가 현장 결제",
            contact_person="박성준 사원",
            contact_phone="010-7343-0634",
            contact_email="psj0523@hanwha.com"
        ))
 
        # 08. 임직원 기념일 선물
        self.benefits.append(BenefitItem(
            title="임직원 기념일 선물",
            target="전 임직원(현장전문직, 파견직 포함)",
            description="본인 지정 기념일에 디퓨저, 홍삼윤고, 꽃다발, 케이크+샴페인 등 선택 상품 자택배송/매장수령 지원",
            contact_person="김민석 사원",
            contact_phone="02-729-5757",
            contact_email="ms085@hanwha.com"
        ))
 
        # 09. 사내도서관 채움
        self.benefits.append(BenefitItem(
            title="사내도서관 채움",
            target="전 임직원",
            description="온라인 도서관(ebook.forena.co.kr)을 통한 도서 대여 서비스, 대여기간 2주",
            contact_person="김민석 사원",
            contact_phone="02-729-5757",
            contact_email="ms085@hanwha.com"
        ))
 
        # 10. 승마장(로얄새들)
        self.benefits.append(BenefitItem(
            title="승마장(로얄새들)",
            target="임직원 및 가족(배우자, 만 8세 이상 자녀, 부모, 배우자부모)",
            description="로얄새들 승마클럽 회원권 이용, 1인당 연 50회(가족 포함), 네이버 예약(2주 전부터 가능)",
            contact_person="박성준 사원",
            contact_phone="010-7343-0634",
            contact_email="psj0523@hanwha.com"
        ))
 
        # 11. 일•가정 양립 지원
        self.benefits.append(BenefitItem(
            title="일•가정 양립 지원",
            target="전 임직원(파견직 제외)",
            description="맘스룸(임산부 휴식/유축 공간), 맘스패키지(임신 축하선물), 난임지원금(최초 1회 30만원) 지원",
            contact_person="박성준 사원",
            contact_phone="010-7343-0634",
            contact_email="psj0523@hanwha.com"
        ))
 
        # 12. 직장어린이집
        self.benefits.append(BenefitItem(
            title="직장어린이집",
            target="임직원 자녀(촉탁 및 PJ직 포함), 만 1세~만 4세",
            description="태평로 어린이집(서울 중구 세종대로 92) 운영, 매년 10월 원아모집, 초과 시 추첨 선발",
            contact_person="박성준 사원",
            contact_phone="010-7343-0634",
            contact_email="psj0523@hanwha.com"
        ))
 
        # 13. 단체상해보험
        self.benefits.append(BenefitItem(
            title="단체상해보험",
            target="전 임직원, 배우자, 미성년자(만 18세 이하) 자녀",
            description="사망/장애, 실손의료비(급여/비급여), 암진단비 보장",
            contact_person="김학철 과장",
            contact_phone="010-4236-4864",
            contact_email="hakchul.kim@hanwha.com"
        ))
 
        # 14. 장기근속자 포상
        self.benefits.append(BenefitItem(
            title="장기근속자 포상",
            target="10년, 20년, 30년, 40년 근속자",
            description="근속 연수별 순금 메달, 포상금/여행상품권, 포상휴가 지급",
            contact_person="김민석 사원",
            contact_phone="02-729-5757",
            contact_email="ms085@hanwha.com"
        ))
 
        # 15. 피트니스(GYM29)
        self.benefits.append(BenefitItem(
            title="피트니스(GYM29)",
            target="본사 근무 직원",
            description="장교동 한화빌딩 29층 GYM29 운영, 월 33,000원(락카비 별도), 1일 1회 이용 가능",
            contact_person="박성준 사원",
            contact_phone="010-7343-0634",
            contact_email="psj0523@hanwha.com"
        ))
 
        # 16. 직원식당
        self.benefits.append(BenefitItem(
            title="직원식당",
            target="전 임직원",
            description="한화빌딩(28층), 63빌딩점, 태평로 한화빌딩 중식 이용 시 회사지원금 제공(조/석식 미지원)",
            contact_person="김학철 과장",
            contact_phone="010-4236-4864",
            contact_email="hakchul.kim@hanwha.com"
        ))
 
        # 17. 사내까페 (벤슨 임직원 할인)
        self.benefits.append(BenefitItem(
            title="사내까페(벤슨 임직원 할인)",
            target="한화 건설부문 전 임직원",
            description="한화빌딩(3층, 28층) 벤슨 커피류/非커피류/아이스크림 할인가 제공",
            contact_person="박성준 사원",
            contact_phone="010-7343-0634",
            contact_email="psj0523@hanwha.com"
        ))
 
        # 18. 통근버스
        self.benefits.append(BenefitItem(
            title="통근버스",
            target="전 임직원",
            description="총 26개 노선 운행(운행사 ㈜위즈돔), '한화스마트버스' 앱 회원가입/노선등록 후 QR코드 탑승",
            contact_person="김민석 사원",
            contact_phone="02-729-5757 / 010-7129-2991",
            contact_email="ms085@hanwha.com"
        ))
 
        # 19. 동호회
        self.benefits.append(BenefitItem(
            title="동호회",
            target="전 임직원",
            description="골프/낚시/볼링/사진/산악/야구/축구/테니스 등 8개 동호회 운영, 정회원 회사지원 1만원/월",
            contact_person="김학철 과장",
            contact_phone="010-4236-4864",
            contact_email="hakchul.kim@hanwha.com"
        ))
 
        # 20. 임직원이사
        self.benefits.append(BenefitItem(
            title="임직원이사",
            target="본사↔현장, 현장↔현장, 현장(본사)↔해외현장 부임/귀임 발령자",
            description="전임 발령자 가재운송비 지원, 7.5톤 이하(1인가구 2.5톤 이하) 순수 포장이사비 및 사다리차 비용 지원",
            contact_person="김민석 사원",
            contact_phone="02-729-5757 / 010-7129-2991",
            contact_email="ms085@hanwha.com"
        ))
 
        # 21. 기타이벤트
        self.benefits.append(BenefitItem(
            title="기타이벤트",
            target="전 임직원",
            description="계절/시즌별 사내 이벤트 및 프로모션 (세부 내용은 사내 공지 게시판 별도 안내)",
            contact_person="인사지원팀",
            contact_phone="-",
            contact_email="-"
        ))
 
    def get_all_benefits(self) -> List[BenefitItem]:
        """전체 복리후생 목록 반환"""
        return self.benefits
 
    def search_by_title(self, keyword: str) -> List[BenefitItem]:
        """제목으로 복리후생 검색"""
        return [item for item in self.benefits if keyword in item.title]
 
    def search_by_contact(self, name: str) -> List[BenefitItem]:
        """담당자명으로 복리후생 검색"""
        return [item for item in self.benefits if name in item.contact_person]
 
 
# --- 사용 예시 ---
if __name__ == "__main__":
    manager = HanwhaWelfareManager()
 
    print("=== [1] 전체 복리후생 항목 ===")
    for item in manager.get_all_benefits():
        print(f"• {item.title} (담당: {item.contact_person} / {item.contact_phone})")
 
    print("\n=== [2] '학자금' 검색 결과 ===")
    search_results = manager.search_by_title("학자금")
    for item in search_results:
        print(f"항목명: {item.title}")
        print(f"대  상: {item.target}")
        print(f"내  용: {item.description}")
        print(f"담당자: {item.contact_person} ({item.contact_email})")
