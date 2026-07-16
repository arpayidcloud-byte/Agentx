import { PermissionLevel } from '../interfaces/index.js';
export class ToolClassifier {
    static classifyCategory(category) {
        // According to ADR-0005, ALL fs.write calls are unconditionally destructive in v0.1
        if (['fs.write', 'shell.exec', 'git.write'].includes(category)) {
            return 'Destructive';
        }
        if (category === 'shell.build') {
            return 'PotentiallyDestructive';
        }
        return 'Safe';
    }
    static getRiskScore(category) {
        const classification = this.classifyCategory(category);
        switch (classification) {
            case 'Destructive':
                return 90;
            case 'PotentiallyDestructive':
                return 50;
            case 'Safe':
                return 10;
            default:
                return 100;
        }
    }
    static requiresApproval(classification) {
        return classification === 'Destructive';
    }
    static getRequiredPermissionLevel(category) {
        const classification = this.classifyCategory(category);
        switch (classification) {
            case 'Destructive':
                return PermissionLevel.DESTRUCTIVE;
            case 'PotentiallyDestructive':
                return PermissionLevel.WRITE;
            case 'Safe':
                return PermissionLevel.READ_ONLY;
            default:
                return PermissionLevel.SYSTEM;
        }
    }
}
//# sourceMappingURL=index.js.map