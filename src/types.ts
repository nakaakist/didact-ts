export type ElementType = string | Function;

export type EffectTag = "UPDATE" | "PLACEMENT" | "DELETION";

export type HookAction = (params: any) => void;
export type Hook = {
  state: any;
  queue: HookAction[];
};

export type Props = Record<string, any>;

export type Dom = HTMLElement | Text;

export type Fiber = {
  type?: ElementType;
  props: Props;
  parent?: Fiber;
  child?: Fiber;
  sibling?: Fiber;
  dom: Dom | null;
  alternate?: Fiber | null;
  effectTag?: EffectTag;
  hooks?: Array<Hook>;
};
