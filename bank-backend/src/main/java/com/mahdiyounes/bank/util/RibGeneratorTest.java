package com.mahdiyounes.bank.util;

public class RibGeneratorTest {
    public static void main(String[] args) {
        // Générer 10 RIBs valides
        System.out.println("RIBs valides générés :");
        System.out.println("======================");

        String rib1 = RibValidator.generateValidRib("001", "230", "0012345678901234");
        System.out.println("RIB 1: " + rib1);

        String rib2 = RibValidator.generateValidRib("011", "450", "1234567890123456");
        System.out.println("RIB 2: " + rib2);

        String rib3 = RibValidator.generateValidRib("007", "100", "9876543210987654");
        System.out.println("RIB 3: " + rib3);

        String rib4 = RibValidator.generateValidRib("013", "200", "5555555555555555");
        System.out.println("RIB 4: " + rib4);

        String rib5 = RibValidator.generateValidRib("015", "300", "1111111111111111");
        System.out.println("RIB 5: " + rib5);

        // Vérifier qu'ils sont valides
        System.out.println("\nVérification :");
        System.out.println("RIB 1 valide ? " + RibValidator.isValidRib(rib1));
        System.out.println("RIB 2 valide ? " + RibValidator.isValidRib(rib2));
        System.out.println("RIB 3 valide ? " + RibValidator.isValidRib(rib3));
    }
}