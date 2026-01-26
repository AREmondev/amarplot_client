import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import {
  fetchPredictions as fetchPredictionsFromApi,
  getPlaceDetails as getPlaceDetailsFromApi,
  AutocompletePrediction,
  PlaceDetails,
} from "@/lib/api/places";

export function useGooglePlacesAutocomplete() {
  const [inputValue, setInputValue] = useState("");
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = useCallback(
    debounce(async (input: string) => {
      if (!input) {
        setPredictions([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchPredictionsFromApi(input);
        setPredictions(data);
      } catch (err) {
        console.error("Error fetching place predictions:", err);
        setError("Network error or API issue.");
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    }, 300), // Debounce for 300ms
    []
  );

  useEffect(() => {
    fetchPredictions(inputValue);
  }, [inputValue, fetchPredictions]);

  const getPlaceDetails = async (
    placeId: string
  ): Promise<PlaceDetails | null> => {
    if (!placeId) return null;

    setLoading(true);
    setError(null);
    try {
      const details = await getPlaceDetailsFromApi(placeId);
      return details;
    } catch (err) {
      console.error("Error fetching place details:", err);
      setError("Network error or API issue.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    inputValue,
    setInputValue,
    predictions,
    loading,
    error,
    getPlaceDetails,
  };
}
