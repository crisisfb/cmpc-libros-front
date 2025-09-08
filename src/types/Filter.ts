export type TextFilterOperator = 
  | 'contains'
  | 'doesNotContain'
  | 'equals'
  | 'doesNotEqual'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'isAnyOf';

export type NumberFilterOperator =
  | 'equals'
  | 'doesNotEqual'
  | '>'
  | '>='
  | '<'
  | '<='
  | 'isEmpty'
  | 'isNotEmpty';

export interface FilterItem {
  field: string;
  operator: TextFilterOperator | NumberFilterOperator;
  value: string | number | null;
}

export interface FilterModel {
  items: FilterItem[];
}
