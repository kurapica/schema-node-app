import { Property } from "schema-node-core";

export interface PushSource {
    push: string;
    source: string;
}

export class Push extends Property<PushSource> {
    override setValue<TValue>(value: TValue): void {
        let push = "";
        let source = "";
        if (Array.isArray(value)) {
            push = value[0]?.toString() ?? "";
            source = value[1]?.toString() ?? "";
        }

        if (source && push) {
            super.setValue({ push, source });
        }
    }
}