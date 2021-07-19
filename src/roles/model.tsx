export enum Feature {
	AssetCreate = "Asset.Create",
	AssetRead = "Asset.Read",
	AssetUpdate = "Asset.Update",
	AssetDestroy = "Asset.Destroy",

	AudioLanguageCreate = "AudioLanguage.Create",
	AudioLanguageUpdate = "AudioLanguage.Update",
	AudioLanguageDestroy = "AudioLanguage.Destroy",

	LabelRepresentative = "Label.Representative",
	LabelExportPayouts = "Label.ExportPayouts",
	LabelImportInvoices = "Label.ImportInvoices",
	LabelImportPayouts = "Label.ImportPayouts",
	LabelImportTransactions = "Label.ImportTransactions",
	LabelGenerateStatements = "Label.GenerateStatements",
	LabelSendStatements = "Label.SendStatements",
	LabelDestroyStatements = "Label.DestroyStatements",
	LabelPublishStatements = "Label.PublishStatements",
	LabelReleaseScheduleCreate = "Label.CreateReleaseSchedule",
	LabelReleaseScheduleUpdate = "Label.UpdateReleaseSchedule",
	LabelReleaseScheduleDestroy = "Label.DestroyReleaseSchedule",
	LabelShareTypeCreate = "Label.CreateShareType",
	LabelShareTypeUpdate = "Label.UpdateShareType",
	LabelShareTypeDestroy = "Label.DestroyShareType",
	LabelPermissionsUpdate = "Label.UpdatePermissions",
	LabelCreateDdexBatch = "Label.CreateDdexBatch",
	LabelDistributorDealsManage = "Label.ManageDistributorDeals",
	LabelDataTypeMapUpdate = "Label.DataTypeMapUpdate",
	LabelCreatePriority = "Label.CreatePriority",
	LabelUpdatePriority = "Label.UpdatePriority",
	LabelDestroyPriority = "Label.DestroyPriority",
	LabelCreateEventCategory = "Label.CreateEventCategory",
	LabelUpdateEventCategory = "Label.UpdateEventCategory",
	LabelDeleteEventCategory = "Label.DeleteEventCategory",

	TrackCreate = "Track.Create",
	TrackRead = "Track.Read",
	TrackUpdate = "Track.Update",
	TrackDestroy = "Track.Destroy",
	TrackLockUpdate = "Track.UpdateLock",
	TrackContractUpdate = "TrackContract.Update",
	TrackPermissionsUpdate = "Track.UpdatePermissions",
	TrackContractPermissionsUpdate = "TrackContract.UpdatePermissions",

	ReleaseCreate = "Release.Create",
	ReleaseRead = "Release.Read",
	ReleaseUpdate = "Release.Update",
	ReleaseDestroy = "Release.Destroy",
	ReleaseLockUpdate = "Release.UpdateLock",
	ReleaseTriggerDdex = "Release.TriggerDdex",
	ReleaseEncode = "Release.Encode",
	ReleasePermissionsUpdate = "Release.UpdatePermissions",

	PrivateLinkCreate = "PrivateLink.Create",
	PrivateLinkUpdate = "PrivateLink.Update",

	CalendarRead = "Calendar.Read",

	EventCreate = "Event.Create",
	EventRead = "Event.Read",
	EventUpdate = "Event.Update",
	EventDestroy = "Event.Destroy",
	EventPermissionsUpdate = "Event.UpdatePermissions",

	FinancialAccountCreate = "FinancialAccount.Create",
	FinancialAccountRead = "FinancialAccount.Read",
	FinancialAccountUpdate = "FinancialAccount.Update",
	FinancialAccountDestroy = "FinancialAccount.Destroy",
	FinancialAccountPermissionsUpdate = "FinancialAccount.UpdatePermissions",

	InvoiceCreate = "Invoice.Create",
	InvoiceRead = "Invoice.Read",
	InvoiceUpdate = "Invoice.Update",
	InvoiceDestroy = "Invoice.Destroy",
	InvoicePublish = "Invoice.Publish",
	InvoicePermissionsUpdate = "Invoice.UpdatePermissions",

	RunCreate = "Run.Create",
	RunRead = "Run.Read",
	RunUpdate = "Run.Update",
	RunDestroy = "Run.Destroy",
	RunPublish = "Run.Publish",

// These are label group features
	SheetCreate = "Sheet.Create",
	SheetRead = "Sheet.Read",
	SheetUpdate = "Sheet.Update",
	SheetDestroy = "Sheet.Destroy",
	SheetProcess = "Sheet.Process",

	LabelCreate = "Label.Create",
	LabelRead = "Label.Read",
	LabelUpdate = "Label.Update",
	LabelDestroy = "Label.Destroy",

// These are system features
	ArtistCreate = "Artist.Create",
	ArtistUpdate = "Artist.Update",
	ArtistDestroy = "Artist.Destroy",
	ArtistUpdatePermissions = "Artist.UpdatePermissions",

	WriterCreate = "Writer.Create",
	WriterUpdate = "Writer.Update",
	WriterDestroy = "Writer.Destroy",
	WriterUpdatePermissions = "Writer.UpdatePermissions",

	SchemaCreate = "Schema.Create",
	SchemaRead = "Schema.Read",
	SchemaUpdate = "Schema.Update",
	SchemaDestroy = "Schema.Destroy",

	LabelGroupCreate = "LabelGroup.Create",
	LabelGroupRead = "LabelGroup.Read",
	LabelGroupUpdate = "LabelGroup.Update",
	LabelGroupDestroy = "LabelGroup.Destroy",
	LabelGroupPermissionsUpdate = "LabelGroup.UpdatePermissions",

	MasterAccountCreate = "MasterAccount.Create",
	MasterAccountStatementsRead = "MasterAccount.ReadStatements",
	MasterAccountUpdate = "MasterAccount.Update",
	MasterAccountDestroy = "MasterAccount.Destroy",
	MasterAccountPermissionsUpdate = "MasterAccount.UpdatePermissions",

	// This is a *special* system feature providing access to the sub-system which manages the
	// system features a user is allowed to have.
	AssignSystemFeatures = "System.AssignFeatures",

	// Reset other's passwords.
	SendResetPassword = "System.SendForgotPassword",
}

export type LabelRole = {
	Id: string
	LabelId: string
	Title: string

	Features?: Feature[]
	NumUsers?: number
}
