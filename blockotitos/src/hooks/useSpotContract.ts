import { useEffect, useState } from "react";
import { Client } from "@stellar/stellar-sdk/contract";
import { network } from "../contracts/util";

const DEFAULT_SPOT_CONTRACT_ID =
  "CC3XATHZKTV7WGEBR337JAH3UTAMQTK7VPPSDSAKHA4KGVOCJPF6P3VF";

const CONTRACT_HTTP_ALLOWED = network.rpcUrl.startsWith("http://");

const loadContractClient = async (
  contractId: string,
  label: string,
): Promise<Client | null> => {
  try {
    return await Client.from({
      contractId,
      networkPassphrase: network.passphrase,
      rpcUrl: network.rpcUrl,
      allowHttp: CONTRACT_HTTP_ALLOWED,
    });
  } catch (error) {
    console.error(`Error creating ${label} contract client:`, error);
    return null;
  }
};

/**
 * Hook para obtener un cliente del contrato SPOT (coleccionable de asistencia)
 * 
 * @param contractId - ID del contrato (opcional, usa variable de entorno si no se proporciona)
 * @returns Cliente del contrato configurado
 */
export const useSpotContract = (contractId?: string) => {
  const envContractId = (import.meta.env.VITE_SPOT_CONTRACT_ID || "").trim();
  const id = contractId || envContractId || DEFAULT_SPOT_CONTRACT_ID;
  const isUsingFallback = !contractId && !envContractId;

  const [spotClient, setSpotClient] = useState<Client | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!id) {
      console.warn(
        "SPOT contract ID not configured. Set VITE_SPOT_CONTRACT_ID in .env",
      );
      setSpotClient(null);
      return;
    }

    if (isUsingFallback && import.meta.env.DEV) {
      console.warn(
        "VITE_SPOT_CONTRACT_ID no está configurado; usando ID por defecto del entorno de ejemplo.",
      );
    }

    setSpotClient(null);

    const initClient = async () => {
      const client = await loadContractClient(id, "SPOT");
      if (!isCancelled) {
        setSpotClient(client);
      }
    };

    void initClient();

    return () => {
      isCancelled = true;
    };
  }, [id, isUsingFallback]);

  return spotClient;
};

/**
 * Hook para obtener un cliente del contrato Factory
 */
export const useFactoryContract = (contractId?: string) => {
  const envContractId = (import.meta.env.VITE_FACTORY_CONTRACT_ID || "").trim();
  const id = contractId || envContractId;
  const [factoryClient, setFactoryClient] = useState<Client | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!id) {
      console.warn(
        "Factory contract ID not configured. Set VITE_FACTORY_CONTRACT_ID in .env",
      );
      setFactoryClient(null);
      return;
    }

    setFactoryClient(null);

    const initClient = async () => {
      const client = await loadContractClient(id, "Factory");
      if (!isCancelled) {
        setFactoryClient(client);
      }
    };

    void initClient();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  return factoryClient;
};

/**
 * Hook para obtener un cliente de un contrato Event específico
 */
export const useEventContract = (contractId: string) => {
  const normalizedId = (contractId || "").trim();
  const [eventClient, setEventClient] = useState<Client | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!normalizedId) {
      setEventClient(null);
      return;
    }

    setEventClient(null);

    const initClient = async () => {
      const client = await loadContractClient(normalizedId, "Event");
      if (!isCancelled) {
        setEventClient(client);
      }
    };

    void initClient();

    return () => {
      isCancelled = true;
    };
  }, [normalizedId]);

  return eventClient;
};

/**
 * Utilidad para crear un cliente de contrato desde un contractId
 */
export const createContractClient = async (
  contractId: string,
): Promise<Client | null> => {
  const normalizedId = (contractId || "").trim();
  if (!normalizedId) {
    return null;
  }

  return loadContractClient(normalizedId, "custom");
};
