export const SystemSetting = sequelize.define('SystemSetting', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, field: 'id' },
  paidModeEnabled: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'paidModeEnabled' },
  monthlyPrice: { type: DataTypes.DOUBLE, defaultValue: 500, field: 'monthlyPrice' },
  yearlyPrice: { type: DataTypes.DOUBLE, defaultValue: 5000, field: 'yearlyPrice' },
  bankName: { type: DataTypes.STRING, allowNull: false, defaultValue: '', field: 'bankName' },
  accountNumber: { type: DataTypes.STRING, allowNull: false, defaultValue: '', field: 'accountNumber' },
  accountHolder: { type: DataTypes.STRING, allowNull: false, defaultValue: '', field: 'accountHolder' },
  qrCodeImage: { type: DataTypes.STRING, allowNull: true, field: 'qrCodeImage' },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updatedAt' },
}, {
  tableName: 'system_settings',
  timestamps: false,
  underscored: false,
});