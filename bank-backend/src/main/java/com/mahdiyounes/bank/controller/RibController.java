package com.mahdiyounes.bank.controller;

import com.mahdiyounes.bank.util.RibValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/rib")
@PreAuthorize("hasRole('AGENT_GUICHET')")
public class RibController {

    @GetMapping("/generate")
    public ResponseEntity<Map<String, String>> generateRib() {
        Random random = new Random();

        // Codes banques valides au Maroc
        String[] codesBanques = {"001", "007", "011", "013", "015"};
        String codeBanque = codesBanques[random.nextInt(codesBanques.length)];

        // Générer un code guichet aléatoire
        String codeGuichet = String.format("%03d", random.nextInt(1000));

        // Générer un numéro de compte aléatoire
        StringBuilder numeroCompte = new StringBuilder();
        for (int i = 0; i < 16; i++) {
            numeroCompte.append(random.nextInt(10));
        }

        // Générer le RIB complet avec la clé valide
        String rib = RibValidator.generateValidRib(codeBanque, codeGuichet, numeroCompte.toString());

        Map<String, String> response = new HashMap<>();
        response.put("rib", rib);
        response.put("ribFormate", RibValidator.formatRib(rib));
        response.put("codeBanque", codeBanque);
        response.put("codeGuichet", codeGuichet);
        response.put("numeroCompte", numeroCompte.toString());
        response.put("cleRib", rib.substring(22, 24));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate/{rib}")
    public ResponseEntity<Map<String, Object>> validateRib(@PathVariable String rib) {
        boolean isValid = RibValidator.isValidRib(rib);

        Map<String, Object> response = new HashMap<>();
        response.put("rib", rib);
        response.put("isValid", isValid);

        if (rib.length() == 24) {
            response.put("codeBanque", rib.substring(0, 3));
            response.put("codeGuichet", rib.substring(3, 6));
            response.put("numeroCompte", rib.substring(6, 22));
            response.put("cleRib", rib.substring(22, 24));
        }

        return ResponseEntity.ok(response);
    }
}