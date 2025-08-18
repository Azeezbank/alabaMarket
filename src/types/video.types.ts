export type CallOffer = {
  fromUserId: string;     // caller userId
  toUserId: string;       // callee userId
  sdp: any;               // SDP offer
  meta?: any;             // optional metadata (productId, orderId, role: buyer/seller, etc)
};

export type CallAnswer = {
  fromUserId: string;     // callee userId (answering)
  toUserId: string;       // caller userId (who started call)
  sdp: any;               // SDP answer
};

export type IceCandidatePayload = {
  fromUserId: string;
  toUserId: string;
  candidate: any;
};