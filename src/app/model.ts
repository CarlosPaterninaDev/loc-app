export interface File {
    path:    string;
    stats:   Summary;
    badFile: boolean;
}

export interface Summary {
    total:      number;
    source:     number;
    comment:    number;
    single:     number;
    block:      number;
    mixed:      number;
    empty:      number;
    todo:       number;
    blockEmpty: number;
}