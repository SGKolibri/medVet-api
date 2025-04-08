import PDFDocument from "pdfkit";
import { Prescription, Medication } from "@prisma/client";

const COLORS = {
  PRIMARY_DARK_GREEN: "#144A36",
  PRIMARY_GREEN: "#007448",
  WHITE: "#FFFFFF",
  BACKGROUND_LIGHT: "#FFFEF9",
  NEUTRAL_GRAY: "#B4B0A8",
};

interface PrescriptionWithMedications extends Prescription {
  medications: Medication[];
  animalName: string;
  species: string;
  age: string;
  gender: string;
  race: string | null;
  teacherName: string | undefined;
  tutorName: string;
}

export async function generatePrescriptionPDF(
  prescription: PrescriptionWithMedications
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 30,
      });

      let buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      doc
        .save()
        .opacity(0.05)
        .scale(0.8)
        .translate(200, 350)
        .moveTo(100, 100)
        .lineTo(150, 50)
        .lineTo(200, 100)
        .lineTo(150, 200)
        .closePath()
        .fill(COLORS.PRIMARY_DARK_GREEN);

      doc
        .moveTo(120, 80)
        .lineTo(180, 80)
        .lineTo(150, 120)
        .closePath()
        .stroke(COLORS.PRIMARY_DARK_GREEN);

      doc
        .moveTo(100, 70)
        .lineTo(120, 50)
        .moveTo(200, 70)
        .lineTo(180, 50)
        .stroke();

      doc.restore();

      doc
        .fillColor(COLORS.PRIMARY_GREEN)
        .rect(40, 40, doc.page.width - 80, 100)
        .fill();

      doc
        .font("Helvetica-Bold")
        .fontSize(24)
        .fillColor(COLORS.WHITE)
        .text("RECEITUÁRIO VETERINÁRIO", 50, 70, { align: "center" });

      doc
        .fontSize(12)
        .fillColor(COLORS.NEUTRAL_GRAY)
        .text("Hospital Veterinário", 50, 110, { align: "center" });

      doc
        .fillColor(COLORS.WHITE)
        .rect(40, 160, doc.page.width - 80, 140)
        .fill();

      doc
        .strokeColor(COLORS.WHITE)
        .lineWidth(1)
        .rect(40, 160, doc.page.width - 80, 140)
        .stroke();

      const detailsConfig = [
        { label: "Paciente:", value: prescription.animalName },
        { label: "Tutor:", value: prescription.tutorName },
        { label: "Espécie:", value: prescription.species },
        { label: "Raça:", value: prescription.race || "N/A" },
        { label: "Idade:", value: prescription.age },
        { label: "Sexo:", value: prescription.gender },
      ];

      let startY = 170;
      const startX = 50;
      const labelWidth = 80;

      detailsConfig.forEach((detail, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;

        doc
          .fillColor(COLORS.PRIMARY_DARK_GREEN)
          .font("Helvetica-Bold")
          .text(detail.label, startX + col * 250, startY + row * 30, {
            width: labelWidth,
          });

        doc
          .fillColor(COLORS.PRIMARY_GREEN)
          .font("Helvetica")
          .text(
            detail.value,
            startX + labelWidth + col * 250,
            startY + row * 30
          );
      });

      startY = 320;
      doc
        .fillColor(COLORS.PRIMARY_DARK_GREEN)
        .font("Helvetica-Bold")
        .fontSize(16)
        .text("PRESCRIÇÃO", startX, startY);

      if (prescription.medications && prescription.medications.length > 0) {
        prescription.medications.forEach((medication, index) => {
          startY += 40;

          doc
            .fillColor(COLORS.WHITE)
            .rect(startX, startY, doc.page.width - 80, 100)
            .fill();

          doc
            .strokeColor(COLORS.WHITE)
            .lineWidth(1)
            .rect(startX, startY, doc.page.width - 80, 100)
            .stroke();

          doc
            .fillColor(COLORS.PRIMARY_DARK_GREEN)
            .fontSize(14)
            .font("Helvetica-Bold")
            .text(
              `Medicação ${medication.measurement}`,
              startX + 10,
              startY + 10
            );

          doc
            .fontSize(12)
            .fillColor(COLORS.PRIMARY_GREEN)
            .text(`Uso: ${medication.use_type}`, startX + 10, startY + 30)
            .text(`Farmácia: ${medication.pharmacy}`, startX + 10, startY + 50)
            .text(`Quantidade: ${medication.unit}`, startX + 300, startY + 30)
            .text(
              `Posologia: ${medication.description}`,
              startX + 300,
              startY + 50
            );

          startY += 120;
        });
      }

      const footerY = doc.page.height - 120;
      const pageWidth = doc.page.width;
      const signatureWidth = 250;
      const signatureX = (pageWidth - signatureWidth) / 2;

      doc
        .strokeColor(COLORS.PRIMARY_GREEN)
        .moveTo(signatureX, footerY)
        .lineTo(signatureX + signatureWidth, footerY)
        .lineWidth(2)
        .stroke();

      doc
        .fillColor(COLORS.PRIMARY_DARK_GREEN)
        .fontSize(10)
        .text("Assinatura e Carimbo do Veterinário", signatureX, footerY + 10, {
          width: signatureWidth,
          align: "center",
        });

      const currentDate = new Date().toLocaleDateString("pt-BR");
      doc.text(currentDate, signatureX, footerY + 25, {
        width: signatureWidth,
        align: "center",
      });

      doc.end();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      reject(error);
    }
  });
}
