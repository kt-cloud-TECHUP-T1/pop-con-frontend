import {
  createBadRequestResponse,
  createServerErrorResponse,
  getServiceBaseUrl,
  handleProxyResponse,
} from '../shared/route-helpers';

const API_BASE_URL = getServiceBaseUrl('popup');

const PHASE_TYPES = ['AUCTION', 'DRAW'] as const;
const PHASE_STATUSES = ['OPEN', 'UPCOMING', 'CLOSED'] as const;
const SORT = ['SOONEST_OPEN'] as const;
const MIN_LIMIT = 1;

export async function GET(request: Request) {
  if (!API_BASE_URL) {
    return createServerErrorResponse();
  }
  const authorization = request.headers.get('Authorization');

  const { searchParams } = new URL(request.url);

  const phaseType = searchParams.get('phaseType');
  const phaseStatus = searchParams.get('phaseStatus');
  const sort = searchParams.get('sort');
  const rawLimit = searchParams.get('limit') ?? '10';
  const limit = Number(rawLimit);

  if (
    !phaseType ||
    !PHASE_TYPES.includes(phaseType as (typeof PHASE_TYPES)[number])
  ) {
    return createBadRequestResponse({
      phaseType: 'phaseType은 AUCTION 또는 DRAW여야 합니다.',
    });
  }

  if (!phaseStatus) {
    return createBadRequestResponse({
      phaseStatus: 'phaseStatus는 필수입니다.',
    });
  }

  const phaseStatuses = phaseStatus.split(',');
  const invalidStatus = phaseStatuses.find(
    (s) => !PHASE_STATUSES.includes(s as (typeof PHASE_STATUSES)[number])
  );
  if (invalidStatus) {
    return createBadRequestResponse({
      phaseStatus: 'phaseStatus는 OPEN, UPCOMING, CLOSED 중 하나여야 합니다.',
    });
  }

  if (sort && !SORT.includes(sort as (typeof SORT)[number])) {
    return createBadRequestResponse({
      sort: 'sort는 SOONEST_OPEN만 허용됩니다.',
    });
  }

  if (!Number.isInteger(limit) || limit < 1) {
    return createBadRequestResponse({
      limit: `limit는 ${MIN_LIMIT} 이상이어야 합니다.`,
    });
  }

  searchParams.set('limit', String(limit));

  try {
    const response = await fetch(`${API_BASE_URL}/popups?${searchParams}`, {
      headers: {
        ...(authorization && { Authorization: authorization }),
      },
      cache: 'no-store',
    });
    return handleProxyResponse(response);
  } catch (error) {
    console.error('[/api/popups]', error);
    return createServerErrorResponse('서버 내부 오류가 발생했습니다.');
  }
}
