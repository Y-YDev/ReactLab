import Flexbox from "@/components/ui/Flexbox";
import { Button, Text } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { useState } from "react";
import { atom, useAtomValue, getDefaultStore } from "jotai";

const fetchCountAtom = atom(0);

const backendItem: string[] = ["Initial Item"];

async function mockFetchData() {
  getDefaultStore().set(fetchCountAtom, (prev) => prev + 1);
  await new Promise((r) => setTimeout(r, 1000)); // 1s de latence
  return _.cloneDeep(backendItem);
}

async function mockSaveData(params: { newItem: string; hasError: boolean }) {
  await new Promise((r) => setTimeout(r, 1000)); // Simulate
  if (params.hasError) {
    throw new Error("Backend error occurred");
  }
  backendItem.push(params.newItem);
}

export default function OptimisticUpdates() {
  const queryClient = useQueryClient();
  const fetchCount = useAtomValue(fetchCountAtom);

  const [error, setError] = useState<string | null>(null);

  const { data: item, isLoading } = useQuery({
    queryKey: ["mock"],
    queryFn: mockFetchData,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: mockSaveData,
    onMutate: async (params: { newItem: string; hasError: boolean }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["mock"] });

      const previousItems = queryClient.getQueryData(["mock"]);
      queryClient.setQueryData(["mock"], (old: string[]) => [
        ...old,
        params.newItem,
      ]);
      return { previousItems };
    },
    onError: async (err, newItem, context) => {
      await queryClient.cancelQueries({ queryKey: ["mock"] });
      queryClient.setQueryData(["mock"], context?.previousItems ?? []);
      queryClient.invalidateQueries({ queryKey: ["mock"] });
      setError(err.message);
    },
  });

  return (
    <Flexbox style={{ padding: "20px", width: "40%" }}>
      <Button
        onClick={() => {
          setError(null);
          mutate({
            newItem: "New Item " + (item?.length ?? 0),
            hasError: false,
          });
        }}
        loading={isPending}
        loadingText="Backend is Saving..."
      >
        Save wih Success
      </Button>

      <Button
        onClick={() => {
          setError(null);
          mutate({
            newItem: "New Item " + (item?.length ?? 0),
            hasError: true,
          });
        }}
        loading={isPending}
        loadingText="Backend is Saving..."
      >
        Save with Error
      </Button>
      {error !== null && <Text color={"red"}>Error: {error}</Text>}
      <Text>Fetch count: {fetchCount}</Text>

      {isLoading ? "LOADING..." : item?.join(", ") ?? "NOTHING HERE"}
    </Flexbox>
  );
}
