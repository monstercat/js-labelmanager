import { LabelManagerApi } from "../types";
import { convertServerTrack, ServerTrack, Track } from "../tracks/model";
import { ServerFile } from "../files/model";
import { convertServerTrackContract, convertTrackContract, ServerTrackContract, TrackContract } from "./model";

export type TrackContractResponse = {
	TrackContract: TrackContract;
	Track: Track;
	Files: ServerFile[];
};
export class TrackContractsApi extends LabelManagerApi {

	/**
	 * Get the specified contract
	 * @param contractId Contract ID
	 * @returns Track Contract information
	 */
	public async getContract(contractId: string): Promise<TrackContractResponse> {
		type GetContractResponse = {
			TrackContract: ServerTrackContract;
			Track: ServerTrack;
			Files: ServerFile[];
		};
		const resp = await this.client.get<GetContractResponse>(`/track-contract/${contractId}`);
		return {
			TrackContract: convertServerTrackContract(resp.data.TrackContract),
			Track: convertServerTrack(resp.data.Track),
			Files: resp.data.Files,
		};
	}

	/**
	 * Get download link for the specified file. Please be prepared for this to switch to a redirect to S3.
	 * @param id Track contract ID
	 * @param fileId File ID
	 * @returns File download URL
	 */
	public trackContractFileUri(id: string, fileId: string): string {
		// this.client.defaults.baseURL is possibly undefined
		return `${this.client.defaults.baseURL}/track-contract/${id}/file/${fileId}`;
	}

	/**
	 * Creates a new contract for the specified track.
	 * @param trackContract Track Contract data
	 * @param updateSatisfiedDate 
	 */
	public createContract(trackContract: TrackContract, updateSatisfiedDate: boolean) {
		type CreateContractResponse = {
			TrackContractId: string;
		};
		return this.client.post<CreateContractResponse>(`/track-contract`, {
			TrackContract: convertTrackContract(trackContract),
			UpdateSatisfiedDate: updateSatisfiedDate
		});
	}

	/**
	 * Updates the specified contract
	 * @param trackContract Track Contract Information
	 * @param updateSatisfiedDate FIXME
	 */
	public updateContract(trackContract: TrackContract, updateSatisfiedDate: boolean): Promise<any> {
		return this.client.post(`/track-contract/${trackContract.Id}`, {
			TrackContract: convertTrackContract(trackContract),
			UpdateSatisfiedDate: updateSatisfiedDate
		});
	}

	/**
	 * Deletes a contract. This cannot be undone
	 * @param id Track contract ID
	 */
	public deleteContract(id: string): Promise<any> {
		return this.client.post(`/track-contract/${id}/delete`);
	}

	/**
	 * Adds a file to the specified contract.
	 * @param id Track contract ID
	 * @param file File to add
	 * @returns File ID of the added file
	 */
	public addContractFile(id: string, file: File): Promise<string> {
		type AddContractFileResponse = {
			FileId: string;
		};
		const data = new FormData();
		data.append("file", file);
		return this.client.post<AddContractFileResponse>(`/track-contract/${id}/file`, data)
			.then(resp => resp.data.FileId);
	}
}

export default TrackContractsApi;