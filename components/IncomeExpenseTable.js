"use client";

import React, { useState } from "react";

import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import "../app/globals.css";

export default function IncomeExpenseTable() {
  const [formData, setFormData] = useState({
    tarih: new Date().toISOString().split("T")[0],
    aciklama: "",
    gelir: 0,
    gider: 0,
    kategori: "Gelir",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTipChange = (e) => {
    const tip = e.target.value;
    setFormData({
      ...formData,
      kategori: tip,
      gelir: tip === "Gelir" ? formData.gelir : 0,
      gider: tip === "Gider" ? formData.gider : 0,
    });
  };

  const handleTutarChange = (e) => {
    const tutar = Number(e.target.value);
    const isGelir = formData.kategori === "Gelir";

    setFormData({
      ...formData,
      gelir: isGelir ? tutar : 0,
      gider: !isGelir ? tutar : 0,
    });
  };

  const handleSubmit = async () => {
    try {
      // Form verilerini doğrulama
      if (!formData.aciklama) {
        alert("Lütfen bir açıklama girin!");
        return;
      }

      if (formData.kategori === "Gelir" && formData.gelir <= 0) {
        alert("Lütfen geçerli bir gelir tutarı girin!");
        return;
      }

      if (formData.kategori === "Gider" && formData.gider <= 0) {
        alert("Lütfen geçerli bir gider tutarı girin!");
        return;
      }

      // Firestore'a veri ekleme
      await addDoc(collection(db, "gelir-gider"), {
        tarih: formData.tarih,
        aciklama: formData.aciklama,
        gelir: Number(formData.gelir),
        gider: Number(formData.gider),
        kategori: formData.kategori,
      });

      alert("Kayıt başarıyla eklendi!");

      // Formu sıfırla (ancak tarihi ve kategoriyi koru)
      setFormData({
        ...formData,
        aciklama: "",
        gelir: 0,
        gider: 0,
      });
    } catch (error) {
      console.error("Veri ekleme hatası:", error);
      alert("Veri eklenirken bir hata oluştu: " + error.message);
    }
  };

  return (
    <div className="income-expense-container">
      <h1 className="income-expense-title">Gelir/Gider Ekle</h1>

      <div className="form-group">
        <label className="form-label">Tarih</label>
        <input
          type="date"
          name="tarih"
          value={formData.tarih}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">İşlem Tipi</label>
        <select
          value={formData.kategori}
          onChange={handleTipChange}
          className="form-select"
        >
          <option value="Gelir">Gelir</option>
          <option value="Gider">Gider</option>
          <option value="Faturalar">Faturalar</option>
          <option value="Gıda">Gıda</option>
          <option value="Ulaşım">Ulaşım</option>
          <option value="Eğlence">Eğlence</option>
          <option value="Sağlık">Sağlık</option>
          <option value="Diğer">Diğer</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Açıklama</label>
        <input
          type="text"
          name="aciklama"
          value={formData.aciklama}
          onChange={handleChange}
          placeholder="İşlem açıklaması"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          {formData.kategori === "Gelir"
            ? "Gelir Tutarı (TL)"
            : "Gider Tutarı (TL)"}
        </label>
        <input
          type="number"
          name="tutar"
          value={
            formData.kategori === "Gelir" ? formData.gelir : formData.gider
          }
          onChange={handleTutarChange}
          placeholder="Tutar"
          className="form-input"
        />
      </div>

      <button onClick={handleSubmit} className="submit-button">
        Kaydet
      </button>
    </div>
  );
}
