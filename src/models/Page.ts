export interface Page {
  id: string;
  slug: string;
  sections: Section[];
}
export interface Section {
  id: string;
  name: string;
  attributes: Attrribute[];
}
export interface Attrribute {
  id: string;
  name: string;
  value: string;
}

export interface AttrributePayload {
  name: string;
  value: string;
}

export interface SectionPayload {
  name: string;
  attributes: AttrributePayload[];
}

export interface IPageBody {
  id?: string;
  slug: string;
  sections: SectionPayload[];
}
  