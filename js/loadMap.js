import { KAKAO_API_KEY } from './config.js';

export const loadKakaoMap = () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`;
        script.defer = true;

        script.onload = () => {
            kakao.maps.load(() => {
                resolve();
            });
        };

        script.onerror = () => {
            reject(new Error('카카오맵 로드 실패'));
        };

        document.head.appendChild(script);
    });
};
