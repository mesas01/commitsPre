import React, { useState } from "react";
import { Layout, Text, Button, Input } from "@stellar/design-system";
import { useWallet } from "../hooks/useWallet";
import { useNavigate } from "react-router-dom";

const CreateEvent: React.FC = () => {
  const { address, isConnected } = useWallet();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    location: "",
    description: "",
    maxSpots: "",
    claimStart: "",
    claimEnd: "",
    imageUrl: "",
    metadataUri: "",
  });

  const [distributionMethods, setDistributionMethods] = useState({
    qr: true,
    link: true,
    geolocation: false,
    code: false,
    nfc: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMethodToggle = (method: keyof typeof distributionMethods) => {
    setDistributionMethods(prev => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert("Por favor, conecta tu wallet primero");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Integrar con el contrato smart contract
      // Por ahora, simulamos la creación
      console.log("Creando evento:", {
        ...formData,
        distributionMethods,
        creator: address,
      });

      // Simular delay de transacción
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert("¡Evento creado exitosamente!");
      navigate("/");
    } catch (error) {
      console.error("Error al crear evento:", error);
      alert("Error al crear evento. Por favor, intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <Layout.Content className="min-h-screen bg-stellar-white">
        <Layout.Inset className="py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">🔐</div>
              <Text as="h2" size="lg" className="text-2xl font-headline text-stellar-black mb-4">
                Conecta tu Wallet
              </Text>
            <Text as="p" size="md" className="text-stellar-black mb-6 font-body">
              Necesitas conectar tu wallet para crear un evento.
            </Text>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/")}
              className="bg-stellar-gold text-stellar-black"
            >
              Ir a Home
            </Button>
          </div>
        </Layout.Inset>
      </Layout.Content>
    );
  }

  return (
    <Layout.Content className="min-h-screen bg-stellar-white">
      <Layout.Inset className="py-6 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            {/* TL;DR - Stellar Brand Manual */}
            <Text as="div" size="sm" className="text-stellar-teal mb-2 font-medium uppercase tracking-wider">
              TL;DR
            </Text>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => navigate("/")}
              className="mb-4"
            >
              ← Volver
            </Button>
            <Text as="h1" size="xl" className="text-3xl md:text-4xl font-headline text-stellar-black mb-2">
              Crear Evento
            </Text>
            <Text as="p" size="md" className="text-stellar-black font-subhead italic">
              Completa el formulario para crear tu evento SPOT
            </Text>
            <div className="bg-stellar-warm-grey/30 rounded-lg p-3 mt-4">
              <Text as="p" size="sm" className="text-stellar-black font-body">
                <span className="font-semibold">TL;DR:</span> Llena el formulario, elige métodos de distribución y crea tu evento. 
                Los asistentes podrán reclamar SPOTs durante el período de claim configurado.
              </Text>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Name */}
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-stellar-black mb-2 font-body uppercase tracking-wide">
                Nombre del Evento *
              </label>
              <Input
                id="eventName"
                name="eventName"
                type="text"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="Ej: Hackathon Stellar 2024"
                required
                className="w-full"
              />
            </div>

            {/* Event Date */}
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-black mb-2">
                Fecha del Evento *
              </label>
              <Input
                id="eventDate"
                name="eventDate"
                type="datetime-local"
                value={formData.eventDate}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-black mb-2">
                Ubicación *
              </label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ej: Bogotá, Colombia"
                required
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-black mb-2">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe tu evento..."
                required
                rows={4}
                className="w-full px-4 py-2 border border-stellar-black/20 rounded-lg focus:ring-2 focus:ring-stellar-lilac focus:border-transparent resize-none"
              />
            </div>

            {/* Max SPOTs */}
            <div>
              <label htmlFor="maxSpots" className="block text-sm font-medium text-black mb-2">
                Máximo de SPOTs *
              </label>
              <Input
                id="maxSpots"
                name="maxSpots"
                type="number"
                value={formData.maxSpots}
                onChange={handleInputChange}
                placeholder="Ej: 100"
                min="1"
                required
                className="w-full"
              />
            </div>

            {/* Claim Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="claimStart" className="block text-sm font-medium text-black mb-2">
                  Inicio de Reclamo *
                </label>
                <Input
                  id="claimStart"
                  name="claimStart"
                  type="datetime-local"
                  value={formData.claimStart}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="claimEnd" className="block text-sm font-medium text-black mb-2">
                  Fin de Reclamo *
                </label>
                <Input
                  id="claimEnd"
                  name="claimEnd"
                  type="datetime-local"
                  value={formData.claimEnd}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-black mb-2">
                URL de la Imagen
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.png"
                className="w-full"
              />
            </div>

            {/* Metadata URI */}
            <div>
              <label htmlFor="metadataUri" className="block text-sm font-medium text-black mb-2">
                URI de Metadata
              </label>
              <Input
                id="metadataUri"
                name="metadataUri"
                type="url"
                value={formData.metadataUri}
                onChange={handleInputChange}
                placeholder="https://example.com/metadata.json"
                className="w-full"
              />
            </div>

            {/* Distribution Methods */}
            <div>
              <label className="block text-sm font-medium text-black mb-4">
                Métodos de Distribución
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={distributionMethods.qr}
                    onChange={() => handleMethodToggle("qr")}
                    className="w-5 h-5 text-stellar-lilac border-stellar-black/20 rounded focus:ring-stellar-lilac"
                  />
                  <span className="text-stellar-black font-body">📷 QR Code</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={distributionMethods.link}
                    onChange={() => handleMethodToggle("link")}
                    className="w-5 h-5 text-stellar-lilac border-stellar-black/20 rounded focus:ring-stellar-lilac"
                  />
                  <span className="text-black">🔗 Unique Link</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={distributionMethods.code}
                    onChange={() => handleMethodToggle("code")}
                    className="w-5 h-5 text-stellar-lilac border-stellar-black/20 rounded focus:ring-stellar-lilac"
                  />
                  <span className="text-black">🔢 Código Compartido</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={distributionMethods.geolocation}
                    onChange={() => handleMethodToggle("geolocation")}
                    className="w-5 h-5 text-stellar-lilac border-stellar-black/20 rounded focus:ring-stellar-lilac"
                  />
                  <span className="text-black">📍 Geolocalización</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={distributionMethods.nfc}
                    onChange={() => handleMethodToggle("nfc")}
                    className="w-5 h-5 text-stellar-lilac border-stellar-black/20 rounded focus:ring-stellar-lilac"
                  />
                  <span className="text-black">💳 NFC</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-stellar-gold text-stellar-black hover:bg-yellow-400 font-semibold"
              >
                {isSubmitting ? "Creando evento..." : "Crear Evento"}
              </Button>
            </div>
          </form>
        </div>
      </Layout.Inset>
    </Layout.Content>
  );
};

export default CreateEvent;

