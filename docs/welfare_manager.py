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
