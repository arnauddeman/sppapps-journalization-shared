import { isArray } from '@sppapps-helpers-shared';

export class JournalizationFilter {
    protected _source: any = {};

    protected _keepNull = false;
    protected _flattened = true;
    protected _keepAll = false;
    protected _processors: { [key: string]: (v: any) => any } = {};
    protected _filters: { [key: string]: JournalizationFilter } = {};
    protected _kept = new Set<string>();
    protected _defaultProcessor: (v: any) => any;

    constructor(data?: any) {
        this.from(data);
    }

    flatten(flattened = true): JournalizationFilter {
        this._flattened = flattened;
        return this;
    }

    from(data: any): JournalizationFilter {

        if (data) {
            this._source = data;
        }
        return this;
    }

    notNull(keepNull = true) {
        this._keepNull = keepNull;
    }

    keepAll(keepAll = true) {
        this._keepAll = keepAll;
    }

    withDefaultProcessor(processor: (v: any) => any): JournalizationFilter {
        if (this._defaultProcessor) {
            throw new Error('Error: default processor already registred');
        }
        this._defaultProcessor = processor;
        return this;
    }

    withProcessor(processor: (v: any) => any, ...fields: string[]): JournalizationFilter {
        fields.forEach(field => {
            if (this._processors[field]) {
                throw new Error('Error while registering processor, processor already registred for: ' + field);
            }

            this._kept.add(field);
            this._processors[field] = processor;
        });

        return this;
    }

    withFilter(filter: JournalizationFilter, ...fields: string[]): JournalizationFilter {
        fields.forEach(field => {
            if (this._filters[field]) {
                throw new Error('Error while registering filter, filter already registred for: ' + field);
            }
            this._kept.add(field);
            this._filters[field] = filter;
        });

        return this;
    }


    protected _flatten(value: any): any {
        if (!this._flattened) {
            return value;
        }

        return value?.length === 1 ? value[0] : value;
    }

    protected _processField(source: any, field: string): any {
        let result = source[field];
        if (this._processors[field]) {
            result = this._processors[field](result);
        } else if (this._defaultProcessor) {
            result = this._defaultProcessor(result);
        }
        if (this._filters[field]) {
            result = this._filters[field]
                .from(result)
                .filter();
        }
        return result;
    }

    protected _filterField(source: any, field: string): boolean {
        return (this._kept.has(field) || this._keepAll) && (source[field] != null || this._keepNull);
    }

    protected _filter(source: any, ...filtred: string[]): any {
        this.keep(...filtred);
        const result: any = {};
        Object.keys(source)
            .filter(k => this._filterField(source, k))
            .forEach(k => result[k] = this._processField(source, k));

        return result;
    }

    keep(...filtred: string[]): JournalizationFilter {
        filtred.forEach(f => this._kept.add(f));
        return this;
    }

    filter(...filtred: string[]): any {
        return isArray(this._source) ?
            this._flatten(this._source.map((o: any) => this._filter(o, ...filtred))) :
            this._filter(this._source, ...filtred);
    }
}

export class JournalizationTrueFilter extends JournalizationFilter {

    constructor(data?: any) {
        super(data);
        this.keepAll();
    }

    protected _filterField(source: any, field: string): boolean {
        return !!source?.[field] && super._filterField(source, field);
    }
}
