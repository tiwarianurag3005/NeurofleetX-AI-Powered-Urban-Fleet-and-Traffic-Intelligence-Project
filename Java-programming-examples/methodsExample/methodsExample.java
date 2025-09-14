package methodsExample;

//1. Compile-time Polymorphism (Method Overloading)
class Calculator {
    // Overloaded methods
    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }

    String add(String a, String b) {
        return a + b;
    }
}

public class methodsExample {
    public static void main(String[] args) {
        Calculator c = new Calculator();
        System.out.println("Sum (int): " + c.add(10, 20));
        System.out.println("Sum (double): " + c.add(5.5, 2.3));
        System.out.println("Sum (string): " + c.add("Hello ", "World"));
    }
}

//2. Runtime Polymorphism (Method Overriding)
class Animal {
    void sound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    void sound() {
        System.out.println("Dog barks");
    }
}

class Cat extends Animal {
    void sound() {
        System.out.println("Cat meows");
    }
}

public class methodsExample {
    public static void main(String[] args) {
        Animal a;

        a = new Dog();
        a.sound();   // Dog barks

        a = new Cat();
        a.sound();   // Cat meows
    }
}


//3. Polymorphism with Interfaces
interface Shape {
    void draw();
}

class Circle implements Shape {
    public void draw() {
        System.out.println("Drawing Circle");
    }
}

class Square implements Shape {
    public void draw() {
        System.out.println("Drawing Square");
    }
}

public class methodsExample {
    public static void main(String[] args) {
        Shape s;

        s = new Circle();
        s.draw();

        s = new Square();
        s.draw();
    }
}

//4. Polymorphism with Abstract Classes
abstract class Vehicle {
    abstract void start();
}

class Car extends Vehicle {
    void start() {
        System.out.println("Car starts with key");
    }
}

class Bike extends Vehicle {
    void start() {
        System.out.println("Bike starts with button");
    }
}

public class methodsExample {
    public static void main(String[] args) {
        Vehicle v;

        v = new Car();
        v.start();

        v = new Bike();
        v.start();
    }
}


//5. Polymorphism using Upcasting
class Payment {
    void pay(int amount) {
        System.out.println("Generic payment of ₹" + amount);
    }
}

class UpiPayment extends Payment {
    void pay(int amount) {
        System.out.println("Paid ₹" + amount + " using UPI");
    }
}

class CardPayment extends Payment {
    void pay(int amount) {
        System.out.println("Paid ₹" + amount + " using Card");
    }
}

public class Main {
    public static void main(String[] args) {
        Payment p;   // Parent reference

        p = new UpiPayment();  // Upcasting
        p.pay(2000);

        p = new CardPayment(); // Upcasting
        p.pay(5000);
    }
}

//6. Method Overloading + Overriding Together
class Bank {
    void loan(int amount) {
        System.out.println("Bank provides loan of ₹" + amount);
    }

    void loan(int amount, double interest) {   // Overloading
        System.out.println("Bank loan: ₹" + amount + " with " + interest + "% interest");
    }
}

class SBI extends Bank {
    @Override
    void loan(int amount) {   // Overriding
        System.out.println("SBI provides loan of ₹" + amount);
    }
}

public class methodsExample {
    public static void main(String[] args) {
        Bank b;

        b = new Bank();
        b.loan(5000);             // Parent method
        b.loan(10000, 7.5);       // Overloaded method

        b = new SBI();
        b.loan(15000);            // Overridden method
    }
}





