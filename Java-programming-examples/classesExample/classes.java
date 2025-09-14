package classesExample;

import java.util.*;

// A simple class

//1. Creating an Object and Accessing Methods
class Car {
    void drive() {
        System.out.println("The car is driving...");
    }
}

public class classes {
    public static void main(String[] args) {
        Car myCar = new Car();   // Create an object
        myCar.drive();           // Call method
    }

}

//2.Using Constructors
class Student {
    String name;
    int age;

    // Constructor
    Student(String n, int a) {
        name = n;
        age = a;
    }

    void display() {
        System.out.println(name + " is " + age + " years old.");
    }
}

public class classes {
    public static void main(String[] args) {
        Student s1 = new Student("Anurag", 21);
        s1.display();
    }
}

//3.Encapsulation
class BankAccount {
    private double balance;

    // Setter
    public void deposit(double amount) {
        balance += amount;
    }

    // Getter
    public double getBalance() {
        return balance;
    }
}

public class classes {
    public static void main(String[] args) {
        BankAccount account = new BankAccount();
        account.deposit(5000);
        System.out.println("Balance: " + account.getBalance());
    }
}

//4.Inheritance
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

public class classes {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.sound();
    }
}

//5. Static Members
class MathHelper {
    static int square(int n) {
        return n * n;
    }
}

public class classes {
    public static void main(String[] args) {
        System.out.println("Square of 5: " + MathHelper.square(5));
    }
}




