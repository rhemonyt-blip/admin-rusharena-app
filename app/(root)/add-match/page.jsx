"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/app/component/application/tostify";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ButtonLoading from "@/app/component/buttonLoading";

export default function TournamentForm() {
  const [prizeDetails, setPrizeDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const form = useForm({
    defaultValues: {
      title: "",
      startTime: "",
      winPrize: 405,
      perKill: 5,
      entryFee: 10,
      entryType: "Solo",
      map: "Bermuda",
      prizeDetails: false,
      joined: 0,
      totalSpots: 48,
      firstPrize: 70,
      secondPrize: 50,
      thirdPrize: 40,
      fourthPrize: 20,
      fifthPrize: 10,
    },
  });
  const onSubmit = async (data) => {
    setLoading(true);
    const matchType = searchParams.get("type");

    // Only include prize details if prizeDetails toggle is true
    if (data.prizeDetails === true) {
      const { firstPrize, secondPrize, thirdPrize, fourthPrize, fifthPrize } =
        form.getValues(); // get current values of these fields

      data.prizeDetails = [
        firstPrize,
        secondPrize,
        thirdPrize,
        fourthPrize,
        fifthPrize,
      ];
    } else {
      data.prizeDetails = [];
    }

    // Include matchType
    data.matchType = matchType;

    // Convert startTime to Date
    data.startTime = new Date(data.startTime);

    try {
      const res = await axios.post("/api/addMatch", { data }); // match API structure
      if (res?.data?.success) {
        showToast("success", "Added successfully");
      } else {
        showToast("error", res?.data?.message || "Something went wrong");
      }
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg mx-auto p-4 border rounded"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter tournament title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date & Time */}
        <FormField
          control={form.control}
          name="startTime"
          rules={{ required: "Date & Time is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="datetime-local"
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Win Prize & Prize Details */}
        <div className="flex gap-3">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="winPrize"
              rules={{ required: "Win Prize is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Win Prize</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1">
            <FormField
              control={form.control}
              name="prizeDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prize Details</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        const boolValue = value === "true";
                        field.onChange(boolValue);
                        setPrizeDetails(boolValue);
                      }}
                      value={field.value ? "true" : "false"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Conditional Prize Inputs */}
        {prizeDetails !== false && (
          <div
            className={`${
              prizeDetails == false && "hidden"
            } grid grid-cols-2 md:grid-cols-3 gap-3 border bg-black/5 p-3 rounded`}
          >
            {[
              "firstPrize",
              "secondPrize",
              "thirdPrize",
              "fourthPrize",
              "fifthPrize",
            ].map((name, index) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`${index + 1}${
                      index === 0
                        ? "st"
                        : index === 1
                        ? "nd"
                        : index === 2
                        ? "rd"
                        : "th"
                    } Prize`}</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>
        )}

        {/* Per Kill */}
        <FormField
          control={form.control}
          name="perKill"
          rules={{ required: "Per Kill is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Per Kill</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Entry Fee */}
        <FormField
          control={form.control}
          name="entryFee"
          rules={{ required: "Entry Fee is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entry Fee</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Entry Type & Map */}
        <div className="flex gap-3">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="entryType"
              rules={{ required: "Entry Type is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Solo">Solo</SelectItem>
                        <SelectItem value="Duo">Duo</SelectItem>
                        <SelectItem value="Squad">Squad</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1">
            <FormField
              control={form.control}
              name="map"
              rules={{ required: "Map is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Map" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bermuda">Bermuda</SelectItem>
                        <SelectItem value="Bermuda 2.0">Bermuda 2.0</SelectItem>
                        <SelectItem value="Lone Wolf">Lone Wolf</SelectItem>
                        <SelectItem value="Kalahari">Kalahari</SelectItem>
                        <SelectItem value="Purgatory">Purgatory</SelectItem>
                        <SelectItem value="Alpine">Alpine</SelectItem>
                        <SelectItem value="NeXTerra">NeXTerra</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Total Spots */}
        <FormField
          control={form.control}
          name="totalSpots"
          rules={{ required: "Total Spots is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Spots</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <ButtonLoading
          type="submit"
          className="w-full mt-4"
          text={" Save Tournament"}
          loading={loading}
        />
      </form>
    </Form>
  );
}
