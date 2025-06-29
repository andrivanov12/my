// Глобальные типы для Яндекс.РТБ
declare global {
  interface Window {
    yaContextCb: Array<() => void>;
    Ya?: {
      Context?: {
        AdvManager?: {
          render: (config: {
            blockId: string;
            renderTo: string;
          }) => void;
        };
      };
    };
  }
}

export {};