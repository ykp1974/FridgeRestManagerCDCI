# Ubuntuの最新LTSを使用
FROM ubuntu:24.04

# 環境変数の設定（対話型プロンプトの停止）
ENV DEBIAN_FRONTEND=noninteractive

# パッケージの更新とNode.jsインストールのためのツールを導入
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# 作業ディレクトリの設定
WORKDIR /app

# コンテナ起動時にBashを立ち上げる
CMD ["/bin/bash"]