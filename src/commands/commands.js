/* global Office */

Office.onReady(() => {
    // 命令處理器初始化
});

// 快速生成郵件命令
function quickGenerate(event) {
    // 實現快速生成功能
    Office.context.ui.displayDialogAsync(
        'https://localhost:3000/src/taskpane/taskpane.html',
        { height: 60, width: 40 },
        (result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                const dialog = result.value;
                dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
                    dialog.close();
                    event.completed();
                });
            }
        }
    );
}

// 註冊命令
Office.actions.associate("quickGenerate", quickGenerate);