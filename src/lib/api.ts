// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://43.201.18.138:8080/api/v1';

// 토큰 관리
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const setToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const removeToken = () => {
  localStorage.removeItem('accessToken');
};

// API 요청 헬퍼
interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = true, headers = {}, ...restOptions } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (requireAuth) {
    const token = getToken();
    if (token) {
      (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: requestHeaders,
    ...restOptions,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  // 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ==================== Auth API ====================
export const authApi = {
  // 소셜 로그인
  socialLogin: (provider: 'KAKAO' | 'NAVER', data: {
    providerUid: string;
    nickname?: string;
    phoneNumber?: string;
    birthday?: string;
    sex?: string;
    imageUrl?: string;
  }) => apiRequest<AuthTokenResponse>(`/auth/social/${provider}/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    requireAuth: false,
  }),

  // 휴대폰 인증번호 발송
  sendPhoneVerification: (phoneNumber: string) =>
    apiRequest<PhoneVerificationSendResponse>('/auth/phone/verifications', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
      requireAuth: false,
    }),

  // 휴대폰 인증번호 확인
  confirmPhoneVerification: (verificationId: string, code: string) =>
    apiRequest<PhoneVerificationConfirmResponse>('/auth/phone/verifications/confirm', {
      method: 'POST',
      body: JSON.stringify({ verificationId, code }),
      requireAuth: false,
    }),

  // 전화번호 로그인
  phoneLogin: (data: {
    phoneVerificationToken: string;
    nickname: string;
    birthday: string;
    sex?: string;
  }) => apiRequest<AuthTokenResponse>('/auth/phone/login', {
    method: 'POST',
    body: JSON.stringify(data),
    requireAuth: false,
  }),
};

// ==================== User API ====================
export const userApi = {
  // 내 프로필 조회
  getMe: () => apiRequest<UserResponse>('/users/me'),

  // 내 프로필 수정
  updateMe: (data: { nickname?: string; sex?: string; imageUrl?: string }) =>
    apiRequest<UserResponse>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // 내 캐시 잔액 조회
  getMyRewards: () => apiRequest<RewardBalanceResponse>('/users/me/rewards'),

  // 내 리워드 트랜잭션 목록
  getMyRewardTransactions: (params?: { page?: number; size?: number }) =>
    apiRequest<PagedResponse<RewardTransactionResponse>>(
      `/users/me/reward-transactions?page=${params?.page || 0}&size=${params?.size || 20}`
    ),
};

// ==================== Ticket API ====================
export const ticketApi = {
  // 티켓 예매번호 인증
  verify: (ticketNumber: string) =>
    apiRequest<TicketVerifyResponse>('/tickets/verify', {
      method: 'POST',
      body: JSON.stringify({ ticketNumber }),
    }),
};

// ==================== Festival API ====================
export const festivalApi = {
  // 축제 목록 조회
  getList: (params?: { q?: string; startFrom?: string; startTo?: string; page?: number; size?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.startFrom) searchParams.set('startFrom', params.startFrom);
    if (params?.startTo) searchParams.set('startTo', params.startTo);
    searchParams.set('page', String(params?.page || 0));
    searchParams.set('size', String(params?.size || 20));
    return apiRequest<PagedResponse<FestivalResponse>>(`/festivals?${searchParams}`, { requireAuth: false });
  },

  // 축제 상세 조회
  getById: (festivalId: number) =>
    apiRequest<FestivalResponse>(`/festivals/${festivalId}`, { requireAuth: false }),

  // 타임테이블 조회
  getTimetable: (festivalId: number, date?: string) => {
    const params = date ? `?date=${date}` : '';
    return apiRequest<TimetableResponse>(`/festivals/${festivalId}/timetable${params}`, { requireAuth: false });
  },
};

// ==================== Booth API ====================
export const boothApi = {
  // 부스 목록 조회
  getList: (params?: {
    festivalId?: number;
    type?: string;
    q?: string;
    openNow?: boolean;
    page?: number;
    size?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.festivalId) searchParams.set('festivalId', String(params.festivalId));
    if (params?.type) searchParams.set('type', params.type);
    if (params?.q) searchParams.set('q', params.q);
    if (params?.openNow) searchParams.set('openNow', 'true');
    searchParams.set('page', String(params?.page || 0));
    searchParams.set('size', String(params?.size || 20));
    return apiRequest<PagedResponse<BoothResponse>>(`/booths?${searchParams}`, { requireAuth: false });
  },

  // 부스 상세 조회
  getById: (boothId: number) =>
    apiRequest<BoothResponse>(`/booths/${boothId}`, { requireAuth: false }),

  // 부스 픽업 슬롯 조회
  getPickupSlots: (boothId: number, params?: { from?: string; to?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.from) searchParams.set('from', params.from);
    if (params?.to) searchParams.set('to', params.to);
    return apiRequest<PickupSlotListResponse>(`/booths/${boothId}/pickup-slots?${searchParams}`, { requireAuth: false });
  },

  // 부스별 메뉴 목록
  getMenus: (boothId: number) =>
    apiRequest<MenuListResponse>(`/booths/${boothId}/menus`, { requireAuth: false }),
};

// ==================== Menu API ====================
export const menuApi = {
  // 메뉴 단건 조회
  getById: (menuId: number) =>
    apiRequest<MenuResponse>(`/menus/${menuId}`, { requireAuth: false }),

  // 메뉴 리뷰 목록
  getReviews: (menuId: number, params?: { ratingGte?: number; page?: number; size?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.ratingGte) searchParams.set('ratingGte', String(params.ratingGte));
    searchParams.set('page', String(params?.page || 0));
    searchParams.set('size', String(params?.size || 20));
    return apiRequest<PagedResponse<ReviewResponse>>(`/menus/${menuId}/reviews?${searchParams}`, { requireAuth: false });
  },

  // 리뷰 작성
  createReview: (menuId: number, data: { rating: number; content: string; imageUrl?: string }) =>
    apiRequest<ReviewResponse>(`/menus/${menuId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ==================== Order API ====================
export const orderApi = {
  // 내 주문 목록 조회
  getList: (params?: { status?: string; boothId?: number; page?: number; size?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.boothId) searchParams.set('boothId', String(params.boothId));
    searchParams.set('page', String(params?.page || 0));
    searchParams.set('size', String(params?.size || 20));
    return apiRequest<PagedResponse<OrderSummaryResponse>>(`/orders?${searchParams}`);
  },

  // 주문 생성
  create: (data: {
    boothId: number;
    type: 'NORMAL' | 'FASTPASS';
    pickupMethod: 'NOW' | 'RESERVE';
    pickupSlotId?: string;
    requestedPickupAt?: string;
    items: { menuId: number; quantity: number }[];
  }) => apiRequest<OrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // 주문 상세 조회
  getById: (orderId: number) =>
    apiRequest<OrderResponse>(`/orders/${orderId}`),

  // 주문 취소
  cancel: (orderId: number, reason?: string) =>
    apiRequest<OrderResponse>(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};

// ==================== Payment API ====================
export const paymentApi = {
  // 결제 생성
  create: (data: { orderId: number; method: 'CARD' | 'TRANSFER' | 'CASH'; idempotencyKey?: string }) =>
    apiRequest<PaymentResponse>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 결제 승인
  confirm: (paymentId: number, data?: { pgTransactionId?: string; approvedAt?: string }) =>
    apiRequest<PaymentResponse>(`/payments/${paymentId}/confirm`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),

  // 결제 취소
  cancel: (paymentId: number, reason?: string) =>
    apiRequest<PaymentResponse>(`/payments/${paymentId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};

// ==================== Alarm API ====================
export const alarmApi = {
  // 내 알림 목록
  getList: (params?: { page?: number; size?: number }) =>
    apiRequest<PagedResponse<AlarmResponse>>(`/alarms?page=${params?.page || 0}&size=${params?.size || 20}`),

  // 알림 설정
  create: (data: { festivalId: number; performanceId: string; notifyMinutesBefore: number }) =>
    apiRequest<AlarmResponse>('/alarms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 알림 해제
  delete: (alarmId: string) =>
    apiRequest<void>(`/alarms/${alarmId}`, { method: 'DELETE' }),
};

// ==================== Chatbot API ====================
export const chatbotApi = {
  // 대화 시작
  createConversation: (data?: { festivalId?: number; context?: Record<string, unknown> }) =>
    apiRequest<ChatConversationResponse>('/chatbot/conversations', {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),

  // 메시지 전송
  sendMessage: (conversationId: string, message: string) =>
    apiRequest<ChatMessageResponse>(`/chatbot/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};

// ==================== Types ====================
export interface AuthTokenResponse {
  tokenType: string;
  accessToken: string;
  expiresInSeconds: number;
  user: UserResponse;
}

export interface UserResponse {
  userId: number;
  nickname: string;
  birthday: string;
  phoneNumber: string;
  sex?: string;
  reward: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhoneVerificationSendResponse {
  verificationId: string;
  expiresInSeconds: number;
}

export interface PhoneVerificationConfirmResponse {
  phoneVerificationToken: string;
}

export interface RewardBalanceResponse {
  rewardBalance: number;
}

export interface RewardTransactionResponse {
  rewardTransactionId: number;
  type: 'TICKET' | 'REVIEW' | 'USE';
  amount: number;
  createdAt: string;
}

export interface TicketVerifyResponse {
  ticketNumber: string;
  isUsed: boolean;
  verifiedAt?: string;
  rewardGranted: number;
  rewardBalance: number;
}

export interface FestivalResponse {
  festivalId: number;
  title: string;
  place: string;
  startAt: string;
  endAt: string;
}

export interface PerformanceResponse {
  performanceId: string;
  festivalId: number;
  title: string;
  stage: string;
  startAt: string;
  endAt: string;
}

export interface TimetableResponse {
  festivalId: number;
  items: PerformanceResponse[];
}

export interface BoothResponse {
  boothId: number;
  festivalId: number;
  title: string;
  place: string;
  type: string;
  startAt: string;
  endAt: string;
  totalReviewCount: number;
  avgReviewRating: number;
}

export interface MenuResponse {
  menuId: number;
  boothId: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface MenuListResponse {
  boothId: number;
  items: MenuResponse[];
}

export interface PickupSlotResponse {
  slotId: string;
  boothId: number;
  startAt: string;
  endAt: string;
  remainingCapacity: number;
  fastpassFee?: number;
}

export interface PickupSlotListResponse {
  boothId: number;
  items: PickupSlotResponse[];
}

export interface ReviewResponse {
  reviewId: number;
  menuId: number;
  rating: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export interface OrderItemResponse {
  orderItemId: number;
  menuId: number;
  quantity: number;
  unitPrice: number;
  menuName: string;
  lineTotalPrice: number;
}

export interface OrderResponse {
  orderId: number;
  userId: number;
  boothId: number;
  orderNumber: string;
  type: 'NORMAL' | 'FASTPASS';
  pickupMethod: 'NOW' | 'RESERVE';
  reservationStatus: 'QUEUED' | 'RESERVED' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'CANCELED' | 'FAILED';
  pickupSlotId?: string;
  pickupAt?: string;
  pickupWindow?: { startAt: string; endAt: string };
  queueNumber?: number;
  estimatedWaitMinutes?: number;
  isPickup: boolean;
  status: 'READY' | 'COMPLETE' | 'CANCELED' | 'FAILED';
  totalPrice: number;
  items: OrderItemResponse[];
}

export interface OrderSummaryResponse {
  orderId: number;
  boothId: number;
  orderNumber: string;
  type: 'NORMAL' | 'FASTPASS';
  pickupMethod: 'NOW' | 'RESERVE';
  reservationStatus: 'QUEUED' | 'RESERVED' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'CANCELED' | 'FAILED';
  pickupAt?: string;
  estimatedWaitMinutes?: number;
  status: 'READY' | 'COMPLETE' | 'CANCELED' | 'FAILED';
  totalPrice: number;
  createdAt?: string;
}

export interface PaymentResponse {
  paymentId: number;
  orderId: number;
  status: 'READY' | 'PAID' | 'FAILED' | 'CANCELED';
  createdAt: string;
}

export interface AlarmResponse {
  alarmId: string;
  festivalId: number;
  performanceId: string;
  notifyMinutesBefore: number;
  createdAt: string;
}

export interface ChatConversationResponse {
  conversationId: string;
  createdAt: string;
}

export interface ChatMessageResponse {
  answer: string;
  citations?: string[];
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
