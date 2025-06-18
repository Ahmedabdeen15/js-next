// ========================
// 🧪 TypeScript HR Lab Starter
// ========================

// TODO: 1. Define enum Role
enum Role {
    Employee = "Employee",
    Manager = "Manager",
    HR = "HR"
}

// TODO: 2. Define Interface Loginable
interface Loginable {
    Authenticate(username: string, password: string): boolean;
}

// TODO: 3. Define abstract class User
abstract class User implements Loginable {
    readonly id: number= HR.generateUserId();
    name: string;
    email: string;
    private password: string;
    createAt: Date;
    constructor(name: string,
        email: string,
        password: string,
        createAt: Date = new Date()
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.createAt = createAt;
    }
    abstract getRole(): string;
    Authenticate(username: string, password: string): boolean {
        return this.password === password && this.email === username;
    }
}

// TODO: 4. Define Department class
class Department {
    name: string;
    private employees: User[] = [];
    constructor(name: string) { 
        this.name = name;
    }

    addEmployee(employee: User): void {
        this.employees.push(employee);
    }

    getEmployees(): User[] {
        return this.employees;
    }
    getEmployeeCount(): number {
        return this.employees.length;
    }
}

// TODO: 5. Define Employee class
class Employee extends User {
    private _salary: number;
    protected department: Department;
    constructor(name: string, email: string, password: string, salary: number, department: Department) {
        super(name, email, password);
        this.salary = salary;
        this.department = department;
        // this.department.addEmployee(this);
    }
    getNetSalary(): number {
        return this._salary - HR.calculateTax(this._salary);
    }
    promote(percentage: number): void {
        if (percentage < 0 || percentage > 100) {
            throw new Error("Percentage must be between 0 and 100");
        }
        this._salary += this._salary * (percentage / 100);
    }
    get salary(): number {
        return this._salary;
    }
    set salary(salary: number) {
        if (salary < 3000) {
            throw new Error("Salary must be at least 3000");
        }
        else {
            this._salary = salary;
        }
    }

    override getRole(): string {
        return Role.Employee;
    }
}

// TODO: 6. Define Manager class

class Manager extends Employee {
    team: Employee[] = [];
    constructor(name: string, email: string, password: string, salary: number, department: Department) {
        super(name, email, password, salary, department);
    }
    addEmployeeToTeam(employee: Employee): void {
        this.team.push(employee);
        this.department.addEmployee(employee);
    }
    removeEmployeeFromTeam(employeeId: number): void {
        if (employeeId > -1) {
            this.team.splice(employeeId, 1);
        }
    }
    getTeamReport(): string {
        return this.team.map(
            emp => `${emp.name} 
            (${emp.email} - ${emp.getRole()}):
             ${emp.salary}`).join("\n");
    }
    override getRole(): string {
        return Role.Manager;
    }
}

// TODO: 7. Define HR utility class

class HR {
    static generateUserId(): number {
        return Math.floor(Math.random() * 10000);
    }
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$ /;
        return emailRegex.test(email);
    }
    static calculateTax(salary: number): number {
        return salary * 0.1; // 10% tax
    }
    static generateReport(users: User[]): string[] {
        const report: string[] = [];
        
        // Group users by role
        const usersByRole = users.reduce((acc, user) => {
            const role = user.getRole();
            if (!acc[role]) {
                acc[role] = [];
            }
            acc[role].push(user);   
            return acc;
        }, {} as Record<string, User[]>);

        // Generate report for each role
        for (const [role, roleUsers] of Object.entries(usersByRole)) {
            report.push(`\n=== ${role}s ===`);
            roleUsers.forEach(user => {
                report.push(`- ${user.name} (${user.email})`);
            });
        }

        return report;
    }
}

// Final test scenario can be written here...
const devDept = new Department("Development");
const hrDept = new Department("HR");

const emp1 = new Employee("Ahmed", "ahmedwaleed@gmail.com", "pass123", 4000, devDept);
const emp2 = new Employee("Ali", "ali@gmail.com", "pass456", 5000, devDept);

const mgr = new Manager("Sara", "sara@gmail.com", "pass789", 7000, hrDept);
mgr.addEmployeeToTeam(emp1);
mgr.addEmployeeToTeam(emp2);

console.log(mgr.getTeamReport());
console.log(`Net salary for ${emp1.name}:`, emp1.getNetSalary());
console.log(HR.generateReport([emp1, emp2, mgr]));