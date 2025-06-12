const handleError = (res, error, customMessage = '伺服器錯誤') => {
  console.error(error);

  // Mongoose 驗證錯誤
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      code: 400,
      message: '欄位驗證錯誤，請確認所有欄位正確填寫',
      result: null,
    });
  }

  // ID 格式錯誤
  if (error.name === 'CastError') {
    return res.status(400).json({
      code: 400,
      message: '無效的 ID 格式',
      result: null,
    });
  }

  // 預設錯誤回應
  return res.status(500).json({
    code: 500,
    message: customMessage,
    result: null,
  });
};

module.exports = handleError