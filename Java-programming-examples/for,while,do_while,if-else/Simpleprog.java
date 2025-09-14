package for,while,do_while,if-else;
import java.util.*;

public class Simpleprog {
    
	public static void main(String[] args) {
		
		
		//System.out.println("hello world");
		
		
		//for_loop code
		
		
       Scanner sc = new Scanner(System.in);
//
//        System.out.print("Enter a number: ");
//        int num = sc.nextInt();
//        long factorial = 1;
//
//        for (int i = 1; i <= num; i++) {
//            factorial *= i;
//        }
//
//        System.out.println("Factorial of " + num + " is " + factorial);
		
		//while loop
       
//		System.out.print("Enter a number: ");
//        int num = sc.nextInt();
//        long factorial = 1;
//        int i = 1;
//
//        while (i <= num) {
//            factorial *= i;
//            i++;
//        }
//
//        System.out.println("Factorial of " + num + " is " + factorial);
       
       //nested if-else

       System.out.print("Enter first number: ");
       int a = sc.nextInt();

       System.out.print("Enter second number: ");
       int b = sc.nextInt();

       System.out.print("Enter third number: ");
       int c = sc.nextInt();

       int greatest;

       if (a > b) {
           if (a > c) {
               greatest = a;
           } else {
               greatest = c;
           }
       } else {
           if (b > c) {
               greatest = b;
           } else {
               greatest = c;
           }
       }

       System.out.println("The greatest number is: " + greatest);

	}

}
