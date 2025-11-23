import { useMutation, useQuery } from "@tanstack/react-query";
import { useWallet } from "./useWallet";
import {
  claimEventRequest,
  createEventRequest,
  fetchClaimedEventsByClaimer,
  fetchMintedCount,
  fetchOnchainEvents,
  type OnchainEventSummary,
} from "../util/backend";

type LegacyEventDetails = {
  event_id: number;
  creator: string;
  event_name: string;
  event_date: string;
  location: string;
  description: string;
  max_poaps: number;
  claim_start: string;
  claim_end: string;
  metadata_uri: string;
  image_url: string;
};

const mapEventToLegacy = (event: OnchainEventSummary): LegacyEventDetails => ({
  event_id: event.eventId,
  creator: event.creator,
  event_name: event.name,
  event_date: String(event.date),
  location: event.location,
  description: event.description,
  max_poaps: event.maxSpots,
  claim_start: String(event.claimStart),
  claim_end: String(event.claimEnd),
  metadata_uri: event.metadataUri ?? "",
  image_url: event.imageUrl,
});

/**
 * Hook para crear un nuevo evento SPOT
 */
export const useCreateEvent = () => {
  const { address } = useWallet();

  return useMutation({
    mutationFn: async (params: {
      eventName: string;
      eventDate: number;
      location: string;
      description: string;
      maxSpots: number;
      claimStart: number;
      claimEnd: number;
      metadataUri: string;
      imageUrl?: string;
    }) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      return createEventRequest({
        creator: address,
        eventName: params.eventName,
        eventDate: params.eventDate,
        location: params.location,
        description: params.description,
        maxPoaps: params.maxSpots,
        claimStart: params.claimStart,
        claimEnd: params.claimEnd,
        metadataUri: params.metadataUri,
        imageUrl: params.imageUrl,
        imageFile: null,
      });
    },
  });
};

/**
 * Hook para reclamar un SPOT (claim)
 */
export const useClaimSpot = () => {
  const { address } = useWallet();

  return useMutation({
    mutationFn: async (eventId: number) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      return claimEventRequest({
        claimer: address,
        eventId,
      });
    },
  });
};

/**
 * Hook para obtener información de un evento
 */
export const useEventInfo = (eventId: number) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const events = await fetchOnchainEvents();
      const event = events.find((item) => item.eventId === eventId);

      if (!event) {
        throw new Error("Event not found");
      }

      return mapEventToLegacy(event);
    },
    enabled: Number.isFinite(eventId) && eventId > 0,
  });
};

/**
 * Hook para obtener todos los eventos
 */
export const useAllEvents = () => {
  return useQuery({
    queryKey: ["allEvents"],
    queryFn: async () => {
      const events = await fetchOnchainEvents();
      return events.map((event) => event.eventId);
    },
  });
};

/**
 * Hook para verificar si un usuario ya reclamó un SPOT de un evento
 */
export const useHasClaimed = (eventId: number, userAddress?: string) => {
  const { address } = useWallet();
  const addressToCheck = userAddress || address;

  return useQuery({
    queryKey: ["hasClaimed", eventId, addressToCheck],
    queryFn: async () => {
      if (!addressToCheck) {
        return false;
      }

      const claimedEvents = await fetchClaimedEventsByClaimer(addressToCheck);
      return claimedEvents.some((event) => event.eventId === eventId);
    },
    enabled: !!addressToCheck && Number.isFinite(eventId) && eventId > 0,
  });
};

/**
 * Hook para obtener el número de SPOTs minteados de un evento
 */
export const useMintedCount = (eventId: number) => {
  return useQuery({
    queryKey: ["mintedCount", eventId],
    queryFn: async () => {
      const { mintedCount } = await fetchMintedCount(eventId);
      return mintedCount;
    },
    enabled: Number.isFinite(eventId) && eventId > 0,
  });
};
