import { PageHeader } from '@/components/shared/page-header';

export default function TermsPage() {
  return (
    <section className="mx-auto w-full max-w-[800px] px-6 py-10 md:px-10">
      <PageHeader
        title="POP-CON 서비스 이용약관"
        titleVariant="heading-1"
        titleWeight="bold"
      />

      <div
        className="flex flex-col gap-8 text-[var(--neutral-40)]"
        style={{ fontSize: 'var(--font-size-body-1)', lineHeight: '1.8' }}
      >
        {/* 1장 */}
        <div>
          <h2
            className="mb-4 font-bold text-[var(--neutral-20)]"
            style={{ fontSize: 'var(--font-size-title-1)' }}
          >
            제 1 장 총칙
          </h2>

          <div className="flex flex-col gap-6">
            <div>
              <h3
                className="mb-2 font-bold text-[var(--neutral-30)]"
                style={{ fontSize: 'var(--font-size-body-1)' }}
              >
                제 1 조 (목적)
              </h3>
              <p>
                본 약관은 POP-CON(이하 &quot;회사&quot;)이 제공하는 프리미엄
                더치 경매, 일반 드로우 서비스 및 제반 서비스(이하
                &quot;서비스&quot;)를 이용함에 있어, 결제, 취소, 환불 및 부정
                이용 제재에 관한 회사와 회원 간의 권리, 의무 및 책임 사항, 기타
                필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </div>

            <div>
              <h3
                className="mb-2 font-bold text-[var(--neutral-30)]"
                style={{ fontSize: 'var(--font-size-body-1)' }}
              >
                제 2 조 (정의)
              </h3>
              <ol className="flex flex-col gap-1.5 pl-1">
                <li>
                  ① &quot;서비스&quot;란 구현되는 단말기(PC, 휴대형 단말기 등)와
                  상관없이 &quot;회원&quot;이 이용할 수 있는 POP-CON의 경매,
                  드로우 및 관련 제반 서비스를 의미합니다.
                </li>
                <li>
                  ② &quot;회원&quot;이란 회사의 &quot;서비스&quot;에 접속하여 이
                  약관에 따라 &quot;회사&quot;와 이용계약을 체결하고
                  &quot;회사&quot;가 제공하는 &quot;서비스&quot;를 이용하는
                  고객을 말합니다.
                </li>
              </ol>
            </div>

            <div>
              <h3
                className="mb-2 font-bold text-[var(--neutral-30)]"
                style={{ fontSize: 'var(--font-size-body-1)' }}
              >
                제 3 조 (약관의 게시와 개정)
              </h3>
              <ol className="flex flex-col gap-1.5 pl-1">
                <li>
                  ① &quot;회사&quot;는 이 약관의 내용을 &quot;회원&quot;이 쉽게
                  알 수 있도록 서비스 초기 화면에 게시합니다.
                </li>
                <li>
                  ② &quot;회사&quot;는 관련 법령을 위배하지 않는 범위에서 이
                  약관을 개정할 수 있으며, 개정 시 적용일자 및 개정사유를
                  명시하여 적용일자 7일 전부터 공지합니다.
                </li>
              </ol>
            </div>
          </div>
        </div>

        <hr className="border-[var(--line-3)]" />

        {/* 2장 */}
        <div>
          <h2
            className="mb-4 font-bold text-[var(--neutral-20)]"
            style={{ fontSize: 'var(--font-size-title-1)' }}
          >
            제 2 장 이용계약 및 의무
          </h2>

          <div className="flex flex-col gap-6">
            <div>
              <h3
                className="mb-2 font-bold text-[var(--neutral-30)]"
                style={{ fontSize: 'var(--font-size-body-1)' }}
              >
                제 4 조 (이용계약 체결)
              </h3>
              <ol className="flex flex-col gap-1.5 pl-1">
                <li>
                  ① 이용계약은 가입신청자가 약관에 동의하고 회원가입 신청을 한
                  후, &quot;회사&quot;가 이를 승낙함으로써 체결됩니다.
                </li>
                <li>
                  ② &quot;회사&quot;는 실명이 아니거나 타인 명의를 도용한 경우,
                  허위 정보를 기재한 경우 승낙을 거절하거나 사후에 계약을 해지할
                  수 있습니다.
                </li>
              </ol>
            </div>

            <div>
              <h3
                className="mb-2 font-bold text-[var(--neutral-30)]"
                style={{ fontSize: 'var(--font-size-body-1)' }}
              >
                제 5 조 (회원의 의무)
              </h3>
              <p>
                회원은 서비스 이용 시 허위 내용 등록, 타인 정보 도용, 회사의
                업무 방해 및 지적재산권 침해 행위를 하여서는 안 됩니다.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-[var(--line-3)]" />

        {/* 3장 */}
        <div>
          <h2
            className="mb-4 font-bold text-[var(--neutral-20)]"
            style={{ fontSize: 'var(--font-size-title-1)' }}
          >
            제 3 장 결제, 취소 및 환불 특약
          </h2>

          <div className="flex flex-col gap-6">
            <div>
              <h3
                className="mb-2 font-bold text-[var(--neutral-30)]"
                style={{ fontSize: 'var(--font-size-body-1)' }}
              >
                제 6 조 (결제 수단의 등록 및 관리)
              </h3>
              <ol className="flex flex-col gap-1.5 pl-1">
                <li>
                  ① 본인 명의 결제 원칙: 회원은 본인인증(CI) 정보와 정확히
                  일치하는 본인 명의의 신용카드 및 체크카드만 결제수단으로
                  등록할 수 있습니다.
                </li>
                <li>
                  ② 이용 제한 수단: 자금 세탁 방지 및 대리 결제 차단을 위해
                  법인카드, 선불카드, 기프트카드, 가상계좌(무통장입금)는 결제
                  수단으로 등록 및 사용할 수 없습니다.
                </li>
                <li>
                  ③ 타인의 명의를 도용하여 결제 수단을 등록하거나 결제를 시도한
                  경우, 회사는 즉시 해당 회원의 자격을 박탈하고 관련 법령에 따라
                  고발 조치할 수 있습니다.
                </li>
              </ol>
            </div>

            <div>
              <h3
                className="mb-2 font-bold text-[var(--neutral-30)]"
                style={{ fontSize: 'var(--font-size-body-1)' }}
              >
                제 7 조 (서비스별 결제 정책)
              </h3>
              <div className="flex flex-col gap-4 pl-1">
                <div>
                  <p className="mb-1 font-medium text-[var(--neutral-30)]">
                    1. 프리미엄 더치 경매
                  </p>
                  <ul className="flex flex-col gap-1 pl-4">
                    <li className="list-disc">
                      경매 참여를 위해서는 사전에 유효한 결제 수단이 등록되어
                      있어야 합니다.
                    </li>
                    <li className="list-disc">
                      회원이 [지금 낙찰하기] 버튼을 클릭하는 즉시, 사전에 등록된
                      결제 수단으로 자동 결제가 진행됩니다.
                    </li>
                    <li className="list-disc">
                      가격 보장: 네트워크 통신 지연이나 초단기 경합이
                      발생하더라도, 회원이 버튼을 클릭한 시점의 시스템 가격을
                      최종 결제 금액으로 보장합니다.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1 font-medium text-[var(--neutral-30)]">
                    2. 일반 드로우
                  </p>
                  <ul className="flex flex-col gap-1 pl-4">
                    <li className="list-disc">
                      결과 확인 및 결제 트리거: 드로우 당첨 여부는 지정된 발표
                      일시에 마이페이지를 통해 회원이 직접 확인(결과
                      확인하기)해야 합니다. 회원이 당첨 결과를 확인하는 순간,
                      사전에 등록 및 선택한 결제 수단으로 자동 결제가
                      요청됩니다.
                    </li>
                    <li className="list-disc">
                      미확인 취소: 결과 발표 시점으로부터 24시간 이내에 결과를
                      확인하지 않을 경우, 당첨 의사가 없는 것으로 간주하여
                      당첨은 자동 취소(미확인 취소)되며 예비 당첨자에게 기회가
                      승계됩니다.
                    </li>
                    <li className="list-disc">
                      결제 실패 유예 기간: 당첨 결과를 확인했으나 카드 한도
                      초과, 잔액 부족 등의 사유로 자동 결제가 실패한 경우,
                      회원은 결제 실패 안내 시점으로부터 24시간 이내에 다른
                      유효한 결제 수단으로 수동 결제를 완료해야 합니다. 기한 내
                      미결제 시 당첨은 최종 취소됩니다.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1 font-medium text-[var(--neutral-30)]">
                    3. 드로우 추가 당첨(예비 당첨) 처리 및 결제
                  </p>
                  <ul className="flex flex-col gap-1 pl-4">
                    <li className="list-disc">
                      취소분 승계: 경매 또는 1차 드로우에서 취소/미결제 물량이
                      발생할 경우, 사전에 고지된 일정(예: 8일 후)에 따라 예비
                      당첨자에게 추가 당첨 기회가 부여됩니다.
                    </li>
                    <li className="list-disc">
                      단기 유예 기간 적용: 행사 일정의 지연 및 재고의 무한
                      대기를 방지하기 위해, 추가 당첨자의 결과 확인 및 미결제
                      유예 기간은 통보 시점으로부터 &#39;24시간&#39;으로 단축
                      적용됩니다. 기한 내 미확인 및 미결제 시 당첨은 영구
                      취소됩니다.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3
                className="mb-2 font-bold text-[var(--neutral-30)]"
                style={{ fontSize: 'var(--font-size-body-1)' }}
              >
                제 8 조 (취소 및 환불 정책)
              </h3>
              <ol className="flex flex-col gap-3 pl-1">
                <li>
                  ① 기본 환불 원칙: 결제 완료 후 회원의 단순 변심에 의한 취소는
                  마이페이지를 통해 가능하며, 행사(공연 등) 일자를 기준으로
                  아래의 위약금(수수료)을 공제한 후 환불됩니다.
                </li>
                <li>
                  ② 행사 임박 예외 (패스트트랙 조항): 원활한 행사 진행과 타
                  회원의 참여 기회 보장을 위해, 행사일 기준 7일 이내에
                  낙찰/당첨되어 결제가 완료된 건은 전액 환불(청약철회) 대상에서
                  제외됩니다. 결제일(승인일)과 무관하게 하단의 &#39;환불 수수료
                  기준표&#39; 상의 임박 일자 규정이 최우선으로 적용되며, 수수료
                  공제 또는 환불이 불가할 수 있습니다.
                </li>
              </ol>

              <div className="mt-4 overflow-hidden rounded-[var(--radius-ds-s)] border border-[var(--line-3)]">
                <table
                  className="w-full text-left"
                  style={{ fontSize: 'var(--font-size-body-2)' }}
                >
                  <thead>
                    <tr className="border-b border-[var(--line-3)] bg-[var(--neutral-95)]">
                      <th className="px-4 py-3 font-bold text-[var(--neutral-30)]">
                        취소 시점
                      </th>
                      <th className="px-4 py-3 font-bold text-[var(--neutral-30)]">
                        환불 규정 (공제 비율)
                      </th>
                      <th className="hidden px-4 py-3 font-bold text-[var(--neutral-30)] sm:table-cell">
                        비고
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--line-2)]">
                      <td className="px-4 py-3">결제 당일 (23시 59분까지)</td>
                      <td className="px-4 py-3">전액 환불 (수수료 0%)</td>
                      <td className="hidden px-4 py-3 text-[var(--neutral-60)] sm:table-cell">
                        단, 행사일 D-1 및 당일 결제 건 제외
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--line-2)]">
                      <td className="px-4 py-3">행사일 10일 ~ 7일 전</td>
                      <td className="px-4 py-3">
                        결제 금액의 10% 공제 후 환불
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell" />
                    </tr>
                    <tr className="border-b border-[var(--line-2)]">
                      <td className="px-4 py-3">행사일 6일 ~ 3일 전</td>
                      <td className="px-4 py-3">
                        결제 금액의 20% 공제 후 환불
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell" />
                    </tr>
                    <tr className="border-b border-[var(--line-2)]">
                      <td className="px-4 py-3">행사일 2일 ~ 1일 전</td>
                      <td className="px-4 py-3">
                        결제 금액의 30% 공제 후 환불
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell" />
                    </tr>
                    <tr>
                      <td className="px-4 py-3">행사일 당일 및 시작 이후</td>
                      <td className="px-4 py-3">환불 불가 (100% 공제)</td>
                      <td className="hidden px-4 py-3 text-[var(--neutral-60)] sm:table-cell">
                        노쇼(No-Show) 포함
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p
                className="mt-2 text-[var(--neutral-60)]"
                style={{ fontSize: 'var(--font-size-label-3)' }}
              >
                ※ 취소 수수료는 결제 금액을 기준으로 산정되며, 환불 처리는
                카드사의 사정에 따라 영업일 기준 3~7일이 소요될 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <hr className="border-[var(--line-3)]" />

        {/* 4장 */}
        <div>
          <h2
            className="mb-4 font-bold text-[var(--neutral-20)]"
            style={{ fontSize: 'var(--font-size-title-1)' }}
          >
            제 4 장 제재 및 면책
          </h2>

          <div className="flex flex-col gap-6">
            <div>
              <h3
                className="mb-2 font-bold text-[var(--neutral-30)]"
                style={{ fontSize: 'var(--font-size-body-1)' }}
              >
                제 9 조 (페널티 및 부정 이용 제재)
              </h3>
              <p className="mb-3">
                회사는 공정한 서비스 환경 조성을 위해 다음 각 호의 행위를 부정
                이용으로 규정하고 강력한 제재를 적용합니다.
              </p>
              <div className="flex flex-col gap-4 pl-1">
                <div>
                  <p className="mb-1 font-medium text-[var(--neutral-30)]">
                    1. 결제 실패 페널티 (경매)
                  </p>
                  <ul className="flex flex-col gap-1 pl-4">
                    <li className="list-disc">
                      사유: 잔액 부족, 정지된 카드 등을 등록하여
                      고의적/반복적으로 경매 재고 선점만 유발하고 결제에
                      실패하는 경우
                    </li>
                    <li className="list-disc">
                      제재: 결제 승인 실패 3회 누적 시, 해당 계정은 발생일로부터
                      7일간 경매 참여가 제한됩니다.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1 font-medium text-[var(--neutral-30)]">
                    2. 미결제 및 취소 페널티 (드로우)
                  </p>
                  <ul className="flex flex-col gap-1 pl-4">
                    <li className="list-disc">
                      사유: 일반 드로우 당첨 후 결제 기한 내 미결제하거나, 결제
                      완료 후 단순 변심으로 취소하는 경우 (추가 당첨자의 단기
                      유예 기간 위반 포함)
                    </li>
                    <li className="list-disc">
                      제재: 해당 계정은 취소일로부터 30일간 플랫폼 내 모든
                      드로우 응모 자격이 박탈됩니다.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1 font-medium text-[var(--neutral-30)]">
                    3. 불법 양도 및 리셀
                  </p>
                  <ul className="flex flex-col gap-1 pl-4">
                    <li className="list-disc">
                      사유 1: 본 서비스에서 낙찰/당첨된 권리나 티켓을 타인에게
                      양도하거나, 중고 거래 플랫폼 등을 통해 금전적 이득을 취할
                      목적으로 재판매(리셀)를 시도하는 경우
                    </li>
                    <li className="list-disc">
                      사유 2: 매크로 프로그램 등 비정상적인 방법으로 시스템에
                      접근하여 재고를 선점하는 경우
                    </li>
                    <li className="list-disc">
                      제재: 적발 즉시 해당 거래는 사전 안내 없이 직권 취소(환불
                      불가)되며, 해당 회원의 계정은 영구 정지됩니다. 또한 동일한
                      본인인증(CI) 정보로 재가입이 영구 차단됩니다.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3
                className="mb-2 font-bold text-[var(--neutral-30)]"
                style={{ fontSize: 'var(--font-size-body-1)' }}
              >
                제 10 조 (면책 조항)
              </h3>
              <ol className="flex flex-col gap-1.5 pl-1">
                <li>
                  ① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여
                  서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이
                  면제됩니다.
                </li>
                <li>
                  ② 회사는 회원의 귀책사유(결제 한도 초과, 통신 장애, 디바이스
                  오류 등)로 인해 경매 낙찰이나 드로우 응모/결제에 실패한 경우
                  책임을 지지 않습니다.
                </li>
                <li>
                  ③ 회원이 본 약관 및 플랫폼의 이용 수칙을 위반하여 발생한 모든
                  불이익에 대한 책임은 회원 본인에게 있습니다.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
