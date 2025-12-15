package com.mahdiyounes.bank.util;

public class RibValidator {

    /**
     * Valider un RIB marocain (24 chiffres)
     */
    public static boolean isValidRib(String rib) {
        System.out.println("Validation RIB: " + rib);

        if (rib == null || rib.length() != 24) {
            System.out.println("Longueur invalide: " + (rib != null ? rib.length() : "null"));
            return false;
        }

        if (!rib.matches("^[0-9]{24}$")) {
            System.out.println("Format invalide: contient des caractères non numériques");
            return false;
        }

        try {
            String codeBanque = rib.substring(0, 3);
            String codeGuichet = rib.substring(3, 6);
            String numeroCompte = rib.substring(6, 22);
            String cleRib = rib.substring(22, 24);

            long accountPart = Long.parseLong(numeroCompte);
            long bankPart = Long.parseLong(codeBanque + codeGuichet);

            int calculatedKey = (int) (97 - ((bankPart * 100 + accountPart) % 97));
            int providedKey = Integer.parseInt(cleRib);

            System.out.println("Clé calculée: " + calculatedKey + ", Clé fournie: " + providedKey);

            return calculatedKey == providedKey;
        } catch (Exception e) {
            System.out.println("Erreur lors de la validation: " + e.getMessage());
            return false;
        }
    }

    /**
     * Formater un RIB pour l'affichage (avec espaces)
     */
    public static String formatRib(String rib) {
        if (rib == null || rib.length() != 24) {
            return rib;
        }
        return rib.substring(0, 3) + " " +
                rib.substring(3, 6) + " " +
                rib.substring(6, 22) + " " +
                rib.substring(22, 24);
    }

    /**
     * Générer un RIB valide
     */
    public static String generateValidRib(String codeBanque, String codeGuichet, String numeroCompte) {
        if (codeBanque.length() != 3 || codeGuichet.length() != 3 || numeroCompte.length() != 16) {
            throw new IllegalArgumentException("Format invalide");
        }

        long bankPart = Long.parseLong(codeBanque + codeGuichet);
        long accountPart = Long.parseLong(numeroCompte);

        int key = (int) (97 - ((bankPart * 100 + accountPart) % 97));
        String cleRib = String.format("%02d", key);

        return codeBanque + codeGuichet + numeroCompte + cleRib;
    }
}